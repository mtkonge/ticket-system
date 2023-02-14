use std::{fs::self, io, path::Path};
use actix_web::{get, HttpRequest, HttpResponse, Responder};
use crate::response_helper::http_default_response;

#[get("/assets/{path:.*}")]
pub async fn load_assets(req: HttpRequest) -> impl Responder {
    let mut path = req.match_info().query("filename").parse().unwrap();
    path = Path::new("../frontend").join(path);

    return match fs::read_to_string(path) {
        Ok(content) =>
            HttpResponse::Ok()
                .body(content),
        Err(err) =>
            if err.kind() == io::ErrorKind::NotFound {
                http_default_response(404)
            } else {
                http_default_response(500)
            },
    };
}
