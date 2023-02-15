mod db;
mod response_helper;
mod routes;
mod token_generation;

use std::sync::Arc;

use crate::db::TicketDb;
use actix_cors::Cors;
use actix_web::web;
use actix_web::{web::Data, App, HttpServer};
use routes::{
    edit_role::edit_role, load_assets::load_assets, load_html::load_html, login::login,
    open_ticket::open_ticket, register::register,
};
use tokio::sync::RwLock;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = Arc::new(RwLock::new(TicketDb::new()));

    HttpServer::new(move || {
        App::new()
            .app_data(Data::from(db.clone()))
            .wrap(Cors::permissive())
            .service(
                web::scope("/api")
                    .service(register)
                    .service(login)
                    .service(edit_role)
                    .service(open_ticket),
            )
            .service(load_assets)
            .service(load_html)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
