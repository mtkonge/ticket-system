use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Db, Document, Error, Role},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    token: String,
    document_id: u64,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
    document: &'a Document,
}

#[post("/document/one")]
async fn one_document(db: web::Data<RwLock<Db>>, request: web::Json<Request>) -> impl Responder {
    let db = (**db).read().await;
    let request = request.into_inner();
    let user = match db.user_from_session(&request.token) {
        Ok(user) => user,
        Err(Error::NotFound) => return bad_request("invalid session"),
        Err(_) => return internal_server_error("db error"),
    };
    let document = match db.document_from_id(request.document_id) {
        Ok(ticket) => ticket,
        Err(Error::NotFound) => return bad_request("invalid id"),
        Err(_) => return internal_server_error("db error"),
    };
    match user.role {
        Role::Consumer => return bad_request("unathorized"),
        _ => (),
    };
    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "success i guess",
            document,
        })
}
