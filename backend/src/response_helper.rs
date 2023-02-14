use actix_web::{http::header::ContentType, HttpResponse};
use serde::Serialize;

#[derive(Serialize)]
struct GenericResponse {
    msg: String,
}

pub fn internal_server_error(msg: String) -> HttpResponse {
    HttpResponse::InternalServerError()
        .insert_header(ContentType::json())
        .json(GenericResponse { msg })
}

pub fn bad_request(msg: String) -> HttpResponse {
    HttpResponse::BadRequest()
        .insert_header(ContentType::json())
        .json(GenericResponse { msg })
}
