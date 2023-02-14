use actix_web::{http::header::ContentType, HttpResponse, body::BoxBody, HttpResponseBuilder, http::StatusCode};
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

pub fn http_default_response(status: u16) -> HttpResponse<BoxBody> {
    HttpResponseBuilder::new(StatusCode::from_u16(status).unwrap())
        .body(format!("<body bgcolor='000'><center><img src='https://http.cat/{0}' alt='{0}'></center></body>", status))
}

