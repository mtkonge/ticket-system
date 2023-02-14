use crate::response_helper::html_default_response;
use actix_web::{get, web, HttpRequest, HttpResponse, Responder};
use std::{fs, io, path::Path};

#[get("/assets/{filename:.*}")]
pub async fn load_assets(_: HttpRequest, filename: web::Path<String>) -> impl Responder {
    let path = Path::new("../frontend/assets").join(Path::new(&*filename));

    match fs::read_to_string(path) {
        Ok(content) => HttpResponse::Ok().body(content),
        Err(err) if err.kind() == io::ErrorKind::NotFound => html_default_response(404),
        Err(_) => html_default_response(500),
    }
}
