use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{TicketDb, TicketDbError},
    response_helper::{bad_request, internal_server_error},
    token_generation::random_valid_string,
};

#[derive(Deserialize)]
pub struct Request {
    username: String,
    password: String,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
    session: &'a str,
}

#[post("/user/login")]
async fn login(db: web::Data<RwLock<TicketDb>>, request: web::Json<Request>) -> impl Responder {
    let mut db = (**db).write().await;

    let request = request.into_inner();

    let user = match db.user_from_name(&request.username) {
        Ok(user) => user,
        Err(TicketDbError::NotFound) => return bad_request("invalid login"),
        Err(TicketDbError::Duplicate) => unreachable!(),
    };

    if user.password != request.password {
        return bad_request("invalid login");
    }

    let Ok(session) = random_valid_string() else {
        return internal_server_error("token error");
    };

    let id = user.id.clone();

    if db.add_session(&session, id).is_err() {
        return internal_server_error("db error");
    };

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "user successfully created",
            session: &session,
        })
}
