use crate::response_helper::html_default_response;
use actix_web::{get, routes, web, HttpRequest, HttpResponse, Responder};
use std::{fs, io, path::Path};

fn file_extension_mime_type<'a>(extension: &str) -> &'a str {
    match extension {
        "html" => "text/html",
        "css" => "text/css",
        "js" => "text/javascript",
        "map" => "application/json",
        "ico" => "image/x-icon",
        _ => "text/plain",
    }
}

#[routes]
#[get("/{path:assets/.*}")]
#[get("/{path:favicon.ico}")]
pub async fn load_assets(_: HttpRequest, path: web::Path<String>) -> impl Responder {
    let path = Path::new("../frontend").join(Path::new(&*path));

    let file_extension = path.extension().unwrap().to_str().unwrap();
    let mime_type = file_extension_mime_type(file_extension);

    match fs::read(path) {
        Ok(content) => HttpResponse::Ok().content_type(mime_type).body(content),
        Err(err) if err.kind() == io::ErrorKind::NotFound => html_default_response(404),
        Err(err) => {
            println!("{}", err);
            html_default_response(500)
        }
    }
}
