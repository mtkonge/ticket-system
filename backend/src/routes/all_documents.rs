use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Role, TicketDb, TicketDbError},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    token: String,
}

#[derive(Serialize)]
struct ShortDocument<'a> {
    id: u64,
    name: &'a str,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
    documents: Vec<ShortDocument<'a>>,
}

#[post("/document/all")]
async fn all_documents(
    db: web::Data<RwLock<TicketDb>>,
    request: web::Json<Request>,
) -> impl Responder {
    let db = (**db).read().await;

    let request = request.into_inner();

    let user = match db.user_from_session(&request.token) {
        Ok(user) => user,
        Err(TicketDbError::NotFound) => return bad_request("invalid session"),
        Err(_) => return internal_server_error("db error"),
    };

    match user.role {
        Role::Admin | Role::LevelTwo | Role::LevelOne => (),
        Role::Consumer => return bad_request("unauthorized"),
    }

    let documents = db
        .documents()
        .iter()
        .map(|doc| ShortDocument {
            id: doc.id,
            name: &doc.name,
        })
        .collect();

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "ticket successfully created",
            documents,
        })
}
