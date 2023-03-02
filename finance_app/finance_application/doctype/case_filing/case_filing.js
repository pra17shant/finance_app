// Copyright (c) 2023, Prashant Kamble and contributors
// For license information, please see license.txt

//........... Loan Section

frappe.ui.form.on(this.frm.doctype, "loan_amount", function(frm) {
	var total = flt(frm.doc.loan_amount) + flt(frm.doc.loan_suraksha);
	frm.set_value("total_loan", total)
		.then(() => delete frm.total);
	frm.refresh();
});
frappe.ui.form.on(this.frm.doctype, "loan_suraksha", function(frm) {
	frm.trigger("loan_amount");
});
frappe.ui.form.on(this.frm.doctype, "grid", function(frm) {
	frm.trigger("loan_amount");
});

//........... EMI Section

frappe.ui.form.on(this.frm.doctype, "tenure", function(frm) {
	var total_loan = flt(frm.doc.total_loan);
	var irr = flt(frm.doc.irr)/(12*100);
	var tenure = flt(frm.doc.tenure);
	var emi = (total_loan * irr * Math.pow(1+irr,tenure))/(Math.pow(1+irr,tenure)-1);
	frm.set_value("emi_amount", emi)
		.then(() => delete frm.emi);
	frm.refresh();
});
frappe.ui.form.on(this.frm.doctype, "irr", function(frm) {
	frm.trigger("tenure");
});
frappe.ui.form.on(this.frm.doctype, "emi_date", function(frm) {
	frm.trigger("tenure");
});

//........... Charges & Expenses
frappe.ui.form.on(this.frm.doctype, "file_charge", function(frm) {
	var total_charges = flt(frm.doc.rto_charge)+flt(frm.doc.krystal_file_charge)+
						flt(frm.doc.insurance_expence);
	frm.set_value("total_charges",total_charges)
		.then(()=> delete frm.total_charges);
		frm.refresh();
});
frappe.ui.form.on(this.frm.doctype, "krystal_file_charge", function(frm) {
	frm.trigger("file_charge");
});
frappe.ui.form.on(this.frm.doctype, "insurance_expence", function(frm) {
	frm.trigger("file_charge");
});
frappe.ui.form.on(this.frm.doctype, "rto_charge", function(frm) {
	frm.trigger("file_charge");
});
frappe.ui.form.on(this.frm.doctype, "other_charge", function(frm) {
	frm.trigger("file_charge");
});

//........... Net Amount Section

frappe.ui.form.on(this.frm.doctype, {
	validate: function(frm) {
	var disbursement_amount = flt(frm.doc.total_loan)-(flt(frm.doc.loan_suraksha)+flt(frm.doc.file_charge));
	var net_payment = flt(frm.doc.disbursement_amount)-flt(frm.doc.total_charges);
	frm.set_value("disbursement_amount",disbursement_amount)
		.then(()=> delete frm.disbursement_amount);
	frm.set_value("net_payment",net_payment)
		.then(()=> delete frm.net_payment);
	
	}
});

//........... Settlement Section
frappe.ui.form.on(this.frm.doctype, "pay_to_applicant", function(frm) {
	
	var balance_amount = flt(frm.doc.net_payment)-(flt(frm.doc.pay_to_applicant)+flt(frm.doc.pay_to_rc_owner)+
						 flt(frm.doc.pay_to_dealer)+flt(frm.doc.pay_to_3rd_party));
	frm.set_value("balance_amount",balance_amount)
		.then(()=> delete frm.total_charges);
		frm.refresh();
	if(flt(frm.doc.balance_amount)>0){
	}else{
		frappe.throw("Payment Value Exceeds as Compared Net Amount");
	}
});
frappe.ui.form.on(this.frm.doctype, "pay_to_rc_owner", function(frm) {
	frm.trigger("pay_to_applicant");
});
frappe.ui.form.on(this.frm.doctype, "pay_to_dealer", function(frm) {
	frm.trigger("pay_to_applicant");
});
frappe.ui.form.on(this.frm.doctype, "pay_to_3rd_party", function(frm) {
	frm.trigger("pay_to_applicant");
});