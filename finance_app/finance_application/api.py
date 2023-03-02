import frappe
@frappe.whitelist()
def total_loan(a,b):
    # loan_suraksha = 0
    # loan_amount = 0
    # total_loan = loan_amount + loan_suraksha
    # return total_loan
    a = a
    b = b
    ans = a + b
    
    frappe.msgprint(ans)
