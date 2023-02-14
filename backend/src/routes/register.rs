use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use futures::lock::Mutex;
use serde::{Deserialize, Serialize};

use crate::{
    db::{Password, Role, TicketDb, TicketDbError, Username},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    username: String,
    password: String,
}

#[derive(Serialize)]
struct Response {
    msg: String,
}

#[post("/user/register")]
async fn register(db: web::Data<Mutex<TicketDb>>, request: web::Json<Request>) -> impl Responder {
    let mut db = (**db).lock().await;

    let request = request.into_inner();

    let add_user_success = db.add_user(
        Username(request.username),
        Password(request.password),
        Role::Member,
    );

    if let Err(TicketDbError::Duplicate) = add_user_success {
        return bad_request("invalid username".to_string());
    } else if add_user_success.is_err() {
        internal_server_error("db error".to_string());
    }

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "user successfully created".to_string(),
        })
}