use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Db, Error, Password, Username},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    username: String,
    password: String,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
}

#[post("/user/register")]
async fn register(db: web::Data<RwLock<Db>>, request: web::Json<Request>) -> impl Responder {
    let mut db = (**db).write().await;

    let request = request.into_inner();

    let add_user_success = db.add_user(Username(request.username), Password(request.password));

    if let Err(Error::Duplicate) = add_user_success {
        return bad_request("invalid username");
    } else if add_user_success.is_err() {
        return internal_server_error("db error");
    }

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "user successfully created",
        })
}
