use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::db::Db;

#[derive(Deserialize)]
struct Request {
    user_ids: Vec<u64>,
}

#[derive(Serialize)]
struct Pair<'a> {
    id: u64,
    name: &'a str,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
    usernames: Vec<Pair<'a>>,
}

#[post("/user/usernames")]
async fn usernames(db: web::Data<RwLock<Db>>, request: web::Json<Request>) -> impl Responder {
    let db = (**db).read().await;
    let request = request.into_inner();
    let usernames = db
        .users()
        .iter()
        .filter(|user| request.user_ids.contains(&user.id))
        .map(|user| Pair {
            id: user.id,
            name: user.name.as_str(),
        })
        .collect();
    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "ok, ig",
            usernames,
        })
}
