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
    title: String,
    content: String,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
}

#[post("/document/create")]
async fn create_document(
    db: web::Data<RwLock<TicketDb>>,
    request: web::Json<Request>,
) -> impl Responder {
    let mut db = (**db).write().await;

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

    match db.add_document(request.title, request.content) {
        Ok(_) => (),
        Err(TicketDbError::Duplicate) => return bad_request("invalid title"),
        Err(_) => return internal_server_error("db error"),
    };

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "document successfully created",
        })
}
