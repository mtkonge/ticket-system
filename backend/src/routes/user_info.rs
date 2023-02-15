use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Role, TicketDb, TicketDbError},
    response_helper::bad_request,
};

#[derive(Deserialize)]
pub struct Request {
    token: String,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
    user_id: u64,
    username: &'a str,
    role: &'a Role,
}

#[post("/user/info")]
async fn user_info(db: web::Data<RwLock<TicketDb>>, request: web::Json<Request>) -> impl Responder {
    let db = (**db).write().await;

    let request = request.into_inner();

    let user = match db.user_from_session(&request.token) {
        Ok(user) => user,
        Err(TicketDbError::NotFound) => return bad_request("invalid session token"),
        Err(TicketDbError::Duplicate) => unreachable!(),
    };

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "",
            user_id: user.id,
            username: &user.name,
            role: &user.role,
        })
}
