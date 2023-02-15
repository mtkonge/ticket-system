use crate::response_helper::html_default_response;
use actix_web::{get, HttpRequest, HttpResponse, Responder};
use std::fs;

#[get("/{path:.*}")]
pub async fn load_html(_: HttpRequest) -> impl Responder {
    match fs::read("../frontend/index.html") {
        Ok(content) => HttpResponse::Ok().content_type("text/html").body(content),
        Err(err) => {
            println!("{err}");
            html_default_response(500)
        }
    }
}
