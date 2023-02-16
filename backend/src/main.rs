#![allow(clippy::unused_async)]

mod db;
mod response_helper;
mod routes;
mod token_generation;

use actix_cors::Cors;
use actix_web::web;
use actix_web::{web::Data, App, HttpServer};
use db::Db;
use routes::{
    all_assignable_users::all_assignable_users, all_documents::all_documents, all_users::all_users,
    create_document::create_document, edit_document::edit_document, edit_role::edit_role,
    edit_ticket::edit_ticket, get_sla::get_sla, load_assets::load_assets, load_html::load_html,
    login::login, one_ticket::one_ticket, open_ticket::open_ticket, post_comment::post_comment,
    reassign_ticket::reassign_ticket, register::register, set_sla::set_sla,
    user_assigned_tickets::user_assigned_tickets, user_created_tickets::user_created_tickets,
    user_info::user_info, usernames::usernames,
};
use std::env;
use std::sync::Arc;
use tokio::sync::RwLock;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let args: Vec<String> = env::args().collect();
    let db = Arc::new(RwLock::new(Db::new()));

    let port: u16 = if args.len() >= 2 {
        args[1].parse().expect("Port number must be numerical")
    } else {
        8080
    };

    HttpServer::new(move || {
        App::new()
            .app_data(Data::from(db.clone()))
            .wrap(Cors::permissive())
            .service(
                web::scope("/api")
                    .service(register)
                    .service(login)
                    .service(one_ticket)
                    .service(edit_role)
                    .service(reassign_ticket)
                    .service(open_ticket)
                    .service(user_info)
                    .service(all_users)
                    .service(all_assignable_users)
                    .service(create_document)
                    .service(edit_ticket)
                    .service(post_comment)
                    .service(edit_document)
                    .service(get_sla)
                    .service(set_sla)
                    .service(all_documents)
                    .service(user_created_tickets)
                    .service(user_assigned_tickets)
                    .service(usernames),
            )
            .service(load_assets)
            .service(load_html)
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}
