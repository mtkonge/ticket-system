use std::{
    fs::{self, metadata},
    io,
    path::Path,
};

use actix_web::{
    body::BoxBody, get, http::StatusCode, web, HttpResponse, HttpResponseBuilder, Responder,
};

#[get("/{filename:.*}")]
pub async fn static_files(filename: web::Path<String>) -> impl Responder {
    let mut path = Path::new("../frontend").join(filename.into_inner());

    match metadata(path.clone()) {
        Ok(md) => {
            if md.is_dir() {
                path = path.join("index.html");
            }
        }
        Err(err) => {
            return if err.kind() == io::ErrorKind::NotFound {
                http_default_response(404)
            } else {
                http_default_response(500)
            }
        }
    }

    match fs::read_to_string(path) {
        Ok(content) => HttpResponse::Ok().body(content),
        Err(err) => {
            if err.kind() == io::ErrorKind::NotFound {
                http_default_response(404)
            } else {
                http_default_response(500)
            }
        }
    }
}

fn http_default_response(status: u16) -> HttpResponse<BoxBody> {
    HttpResponseBuilder::new(StatusCode::from_u16(status).unwrap()).body(format!(
        "<body bgcolor='000'><center><img src='https://http.cat/{0}' alt='{0}'></center></body>",
        status
    ))
}
