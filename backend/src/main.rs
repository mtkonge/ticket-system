mod db;
mod response_helper;
mod routes;
mod token_generation;

use crate::db::TicketDb;
use actix_cors::Cors;
use actix_web::web;
use actix_web::{web::Data, App, HttpServer};
use routes::load_assets::load_assets;
use routes::load_html::load_html;
use routes::login::login;
use routes::register::register;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = TicketDb::new();

    HttpServer::new(move || {
        App::new()
            .app_data(Data::from(db.clone()))
            .wrap(Cors::permissive())
            .service(web::scope("/api").service(register).service(login))
            .service(load_assets)
            .service(load_html)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
