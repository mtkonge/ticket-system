use actix_web::{
    body::BoxBody, http::header::ContentType, http::StatusCode, HttpResponse, HttpResponseBuilder,
};
use serde::Serialize;

use crate::db::{Ticket, TicketComment};

#[derive(Serialize)]
struct GenericResponse<'a> {
    msg: &'a str,
}

pub fn internal_server_error(msg: &str) -> HttpResponse {
    HttpResponse::InternalServerError()
        .insert_header(ContentType::json())
        .json(GenericResponse { msg })
}

pub fn bad_request(msg: &str) -> HttpResponse {
    HttpResponse::BadRequest()
        .insert_header(ContentType::json())
        .json(GenericResponse { msg })
}

pub fn html_default_response(status: u16) -> HttpResponse<BoxBody> {
    HttpResponseBuilder::new(
        StatusCode::from_u16(status).expect("value provided should be 100 >= value < 1000"),
    )
    .body(format!(
        "<body bgcolor='000'><center><img src='https://http.cat/{status}' alt='{status}'></center></body>"
    ))
}

#[derive(Serialize)]
pub struct ResponseTicket {
    pub id: u64,
    pub title: String,
    pub content: String,
    pub creator: u64,
    pub assignee: u64,
    pub comments: Vec<ResponseTicketComment>,
}

#[derive(Serialize)]
pub struct ResponseTicketComment {
    pub id: u64,
    pub message: String,
    pub user_id: u64,
}

impl From<TicketComment> for ResponseTicketComment {
    fn from(comment: TicketComment) -> Self {
        ResponseTicketComment {
            id: comment.id.0,
            message: comment.message,
            user_id: comment.user_id.0,
        }
    }
}

impl From<Ticket> for ResponseTicket {
    fn from<'a>(ticket: Ticket) -> Self {
        ResponseTicket {
            id: ticket.id.0,
            title: ticket.title,
            content: ticket.content,
            creator: ticket.creator.0,
            assignee: ticket.assignee.0,
            comments: ticket
                .comments
                .into_iter()
                .map(|comment| comment.into())
                .collect(),
        }
    }
}
