use futures::lock::Mutex;
use std::sync::Arc;

pub struct TicketDb {
    amount: u32,
}

impl TicketDb {
    pub fn new() -> Arc<Mutex<Self>> {
        Arc::new(Mutex::new(TicketDb { amount: 0 }))
    }
    pub fn increment_amount(&mut self) {
        self.amount += 1;
    }
    pub fn get_amount(&mut self) -> u32 {
        self.amount
    }
}
