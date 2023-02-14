use crate::response_helper::http_default_response;
use actix_web::{get, HttpRequest, HttpResponse, Responder};
use std::fs;

#[get("/")]
pub async fn load_html(_: HttpRequest) -> impl Responder {
    match fs::read_to_string("../frontend/index.html") {
        Ok(content) => HttpResponse::Ok().content_type("text/html").body(content),
        Err(_) => http_default_response(500),
    }
}