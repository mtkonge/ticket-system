mod db;

use actix_cors::Cors;
use actix_web::{
    get,
    http::header::ContentType,
    web::{self, Data},
    App, HttpRequest, HttpResponse, HttpServer, Responder,
};
use futures::lock::Mutex;
use serde::Serialize;

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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = TicketDb::new();

    HttpServer::new(move || {
        App::new()
            .app_data(Data::from(db.clone()))
            .wrap(Cors::permissive())
            .service(increment)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
