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
    all_documents::all_documents, all_users::all_users, create_document::create_document,
    edit_document::edit_document, edit_role::edit_role, edit_ticket::edit_ticket,
    load_assets::load_assets, load_html::load_html, login::login, open_ticket::open_ticket,
    post_comment::post_comment, register::register, user_assigned_tickets::user_assigned_tickets,
    user_created_tickets::user_created_tickets, user_info::user_info,
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
                    .service(open_ticket)
                    .service(user_info)
                    .service(all_users)
                    .service(create_document)
                    .service(edit_ticket)
                    .service(post_comment)
                    .service(edit_document)
                    .service(all_documents)
                    .service(user_created_tickets)
                    .service(user_assigned_tickets),
            )
            .service(load_assets)
            .service(load_html)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
