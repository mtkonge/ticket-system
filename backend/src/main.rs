mod db;

use actix_cors::Cors;
use actix_web::{
    get,
    body::BoxBody,
    http::StatusCode,
    http::header::{ContentType},
    web::{self, Data},
    App, HttpRequest, HttpResponse, HttpResponseBuilder, HttpServer, Responder,
};
use futures::lock::Mutex;
use serde::Serialize;
use std::path::Path;
use std::fs;
use std::fs::metadata;
use std::io;

use crate::db::TicketDb;

#[derive(Serialize)]
struct Response {
    amount: u32,
}

#[get("/increment")]
async fn increment(db: web::Data<Mutex<TicketDb>>, _req: HttpRequest) -> impl Responder {
    let mut db = (**db).lock().await;

    db.increment_amount();

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            amount: db.get_amount(),
        })
}

#[get("/{filename:.*}")]
async fn static_files(req: HttpRequest) -> impl Responder {
    let mut path = req.match_info().query("filename").parse().unwrap();
    path = Path::new("../frontend").join(path);

    match metadata(path.clone()) {
        Ok(md) => {
            if md.is_dir() {
                path = path.join("index.html");
            }
        },
        Err(err) =>
            return if err.kind() == io::ErrorKind::NotFound {
                http_default_response(404)
            } else {
                http_default_response(500)
            },
    }

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

fn http_default_response(status: u16) -> HttpResponse<BoxBody> {
    HttpResponseBuilder::new(StatusCode::from_u16(status).unwrap())
        .body(format!("<body bgcolor='000'><center><img src='https://http.cat/{0}' alt='{0}'></center></body>", status))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = TicketDb::new();

    HttpServer::new(move || {
        App::new()
            .app_data(Data::from(db.clone()))
            .wrap(Cors::permissive())
            .service(increment)
            .service(static_files)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
