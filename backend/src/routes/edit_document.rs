use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Db, Error, Role},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    id: u64,
    token: String,
    title: String,
    content: String,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
}

#[post("/document/edit")]
async fn edit_document(db: web::Data<RwLock<Db>>, request: web::Json<Request>) -> impl Responder {
    let mut db = (**db).write().await;

    let request = request.into_inner();

    let user = match db.user_from_session(&request.token) {
        Ok(user) => user,
        Err(Error::NotFound) => return bad_request("invalid session"),
        Err(_) => return internal_server_error("db error"),
    };

    match user.role {
        Role::Admin | Role::LevelTwo | Role::LevelOne => (),
        Role::Consumer => return bad_request("unauthorized"),
    }

    match db.edit_document(request.id, request.title, request.content) {
        Ok(_) => (),
        Err(Error::Duplicate) => return bad_request("invalid title"),
        Err(Error::NotFound) => return bad_request("invalid id"),
    };

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "document successfully edited",
        })
}
