use crate::response_helper::html_default_response;
use actix_web::{get, routes, web, HttpRequest, HttpResponse, Responder};
use std::{fs, io, path::Path};

#[routes]
#[get("/{path:assets/.*}")]
#[get("/{path:favicon.ico}")]
pub async fn load_assets(_: HttpRequest, path: web::Path<String>) -> impl Responder {
    let path = Path::new("../frontend").join(Path::new(&*path));

    match fs::read(path) {
        Ok(content) => HttpResponse::Ok().body(content),
        Err(err) if err.kind() == io::ErrorKind::NotFound => html_default_response(404),
        Err(err) => {
            println!("{}", err);
            html_default_response(500)
        },
    }
}
