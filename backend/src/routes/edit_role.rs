use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Id, Role, TicketDb, TicketDbError},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    token: String,
    user_id: u64,
    role: Role,
}

#[derive(Serialize)]
struct Response {
    msg: String,
}

#[post("/user/edit_role")]
async fn role_change(
    db: web::Data<RwLock<TicketDb>>,
    request: web::Json<Request>,
) -> impl Responder {
    let mut db = (**db).write().await;

    let request = request.into_inner();

    let user = match db.user_from_session(&request.token) {
        Ok(user) if user.id.0 == request.user_id => return bad_request("cannot edit own role"),
        Ok(user) => user,
        Err(TicketDbError::Duplicate) => return bad_request("invalid session"),
        Err(_) => return bad_request("db error"),
    };

    let Role::Admin = user.role else {
        return bad_request("unauthorized")
    };

    if db
        .edit_user_role(Id(request.user_id), request.role)
        .is_err()
    {
        return internal_server_error("db error");
    };

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "user successfully created".to_string(),
        })
}
