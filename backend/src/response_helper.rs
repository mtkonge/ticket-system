use actix_web::{
    body::BoxBody, http::header::ContentType, http::StatusCode, HttpResponse, HttpResponseBuilder,
};
use serde::Serialize;

#[derive(Serialize)]
struct GenericResponse<'a> {
    msg: &'a str,
}

pub fn internal_server_error(msg: &str) -> HttpResponse {
    HttpResponse::InternalServerError()
        .insert_header(ContentType::json())
        .json(GenericResponse { msg })
}

pub fn bad_request(msg: &str) -> HttpResponse {
    HttpResponse::BadRequest()
        .insert_header(ContentType::json())
        .json(GenericResponse { msg })
}

pub fn html_default_response(status: u16) -> HttpResponse<BoxBody> {
    HttpResponseBuilder::new(
        StatusCode::from_u16(status).expect("value provided should be 100 >= value < 1000"),
    )
    .body(format!(
        "<body bgcolor='000'><center><img src='https://http.cat/{0}' alt='{0}'></center></body>",
        status
    ))
}
