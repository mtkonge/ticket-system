use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Db, Error, Role},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    token: String,
    id: u64,
    assignee: u64,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
}

#[post("/ticket/reassign")]
async fn reassign_ticket(db: web::Data<RwLock<Db>>, request: web::Json<Request>) -> impl Responder {
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

    match db.edit_ticket(request.id, None, Some(request.assignee), None) {
        Ok(_) => (),
        Err(Error::NotFound) => return bad_request("invalid id"),
        Err(_) => return internal_server_error("db error"),
    };

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "document successfully edited",
        })
}
