// Copyright (c) 2023, Prashant Kamble and contributors
// For license information, please see license.txt

//........... Loan Section
frappe.ui.form.on(this.frm.doctype,{
	refresh(frm){
		frm.set_value("balance_amount",net_payment)
		.then(()=> delete frm.balance_amount);
		frm.refresh();
	},

	validate(frm){
		if(flt(frm.doc.paid_amount)>flt(frm.doc.net_payment)){
			frappe.throw("Not Allowd to More than Net Payment Amount");
			frm.refresh();
		}
	},
	after_save(frm){
		//frm.set_value("status","Draft")
		//frm.refresh();

	},
	before_submit(frm){
	
		if(flt(frm.doc.paid_amount)!=flt(frm.doc.net_payment)){
			
			frappe.throw("Payment Not Done Yet to the Customer");
			frm.refresh();
		}
		else
		{
		frm.set_value("status","Complete")
		frm.refresh();
		}
	},
	on_submit(frm){
		
	}

});

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
frappe.ui.form.on(this.frm.doctype, {
	validate: function(frm) {
		var total_loan 	=0
		var irr 		=0
		var tenure 		=0
		var emi 		=0
		if(flt(frm.doc.emi_amount) == 0){}
		total_loan 	= flt(frm.doc.total_loan);
		irr 		= flt(frm.doc.irr)/(12*100);
		tenure 		= flt(frm.doc.tenure);
		emi 		= (total_loan * irr * Math.pow(1+irr,tenure))/(Math.pow(1+irr,tenure)-1);
		frm.set_value("emi_amount", emi.toFixed(2))
			.then(() => delete frm.emi);
		frm.refresh();
	}	
});
// frappe.ui.form.on(this.frm.doctype, "irr", function(frm) {
// 	frm.trigger("myfrm");
// });
// frappe.ui.form.on(this.frm.doctype, "emi_date", function(frm) {
// 	frm.trigger("tenure");
// });

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
	frm.set_value("disbursement_amount",disbursement_amount)
		.then(()=> delete frm.disbursement_amount);
	
	var net_payment = flt(frm.doc.disbursement_amount)-flt(frm.doc.total_charges);
	frm.set_value("net_payment",net_payment)
	.then(()=> delete frm.net_payment);
	}
});

//........... Settlement Section
frappe.ui.form.on(this.frm.doctype, "pay_to_applicant", function(frm) {
	var balance_amount = 0
	var paid_amount = 0
	paid_amount = (flt(frm.doc.pay_to_applicant)+flt(frm.doc.pay_to_rc_owner)+flt(frm.doc.pay_to_dealer)+flt(frm.doc.pay_to_3rd_party));
	balance_amount = flt(frm.doc.net_payment)-flt(paid_amount);

	frm.set_value("balance_amount",balance_amount)
		.then(()=> delete frm.balance_amount);

	frm.set_value("paid_amount",paid_amount)
		.then(()=> delete frm.paid_amount);
		frm.refresh();
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