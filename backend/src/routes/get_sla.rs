use actix_web::{http::header::ContentType, post, web, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Db, Document, Error},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
    document: &'a Document,
}

#[post("/sla/get")]
async fn get_sla(db: web::Data<RwLock<Db>>, _: HttpRequest) -> impl Responder {
    let db = (**db).read().await;

    let document = match db.sla() {
        Ok(doc) => doc,
        Err(Error::NotFound) => return bad_request("no sla set or sla deleted"),
        Err(_) => return internal_server_error("db error"),
    };

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "sla acquired",
            document,
        })
}
