// Mock data for demonstration purposes
let products = [
    { product_id: 1, product_name: "Laptop", category: "Electronics", price: 999.99, stock_quantity: 15, min_stock: 5, last_updated: "2025-05-01" },
    { product_id: 2, product_name: "Smartphone", category: "Electronics", price: 499.99, stock_quantity: 25, min_stock: 10, last_updated: "2025-05-02" },
    { product_id: 3, product_name: "Desk Chair", category: "Furniture", price: 149.99, stock_quantity: 8, min_stock: 5, last_updated: "2025-05-03" },
    { product_id: 4, product_name: "Coffee Maker", category: "Appliances", price: 79.99, stock_quantity: 12, min_stock: 3, last_updated: "2025-05-04" },
    { product_id: 5, product_name: "Headphones", category: "Electronics", price: 89.99, stock_quantity: 2, min_stock: 5, last_updated: "2025-05-05" }
];

let sales = [
    { sale_id: 1, date: "2025-05-01", product_id: 1, product_name: "Laptop", quantity: 2, total: 1999.98, customer: "John Doe" },
    { sale_id: 2, date: "2025-05-02", product_id: 2, product_name: "Smartphone", quantity: 1, total: 499.99, customer: "Jane Smith" },
    { sale_id: 3, date: "2025-05-05", product_id: 4, product_name: "Coffee Maker", quantity: 3, total: 239.97, customer: "Bob Johnson" },
    { sale_id: 4, date: "2025-05-07", product_id: 5, product_name: "Headphones", quantity: 1, total: 89.99, customer: "Alice Brown" }
];

let activities = [
    { date: "2025-05-07", activity: "Sale", user: "Admin", details: "Sold 1 Headphones to Alice Brown" },
    { date: "2025-05-07", activity: "Stock Update", user: "Admin", details: "Updated Headphones stock to 2" },
    { date: "2025-05-05", activity: "Sale", user: "Admin", details: "Sold 3 Coffee Makers to Bob Johnson" },
    { date: "2025-05-03", activity: "New Product", user: "Admin", details: "Added Desk Chair to inventory" }
];

let reports = [
    { name: "Monthly Sales", type: "Sales Report", date_range: "Apr 1 - Apr 30, 2025", generated: "May 1, 2025" },
    { name: "Q1 Inventory", type: "Inventory Report", date_range: "Jan 1 - Mar 31, 2025", generated: "Apr 5, 2025" },
    { name: "Low Stock Alert", type: "Low Stock Items", date_range: "Current", generated: "May 5, 2025" }
];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    init();
    
    // Add event listeners
    addEventListeners();
});

function init() {
    // Show dashboard by default
    showSection('dashboard');
    
    // Load all data
    loadDashboardStats();
    loadActivityLog();
    loadProductTable();
    loadSalesTable();
    loadInventoryTable();
    loadProductDropdowns();
    loadReportsTable();
    
    // Set today's date as default for sales and reports
    document.getElementById('saleDate').valueAsDate = new Date();
    document.getElementById('startDate').valueAsDate = new Date(new Date().setDate(new Date().getDate() - 30));
    document.getElementById('endDate').valueAsDate = new Date();
}

function addEventListeners() {
    // Form submissions
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('addSaleForm').addEventListener('submit', handleAddSale);
    document.getElementById('updateStockForm').addEventListener('submit', handleUpdateStock);
    document.getElementById('editProductForm').addEventListener('submit', handleEditProduct);
    document.getElementById('reportForm').addEventListener('submit', handleGenerateReport);
    
    // Search inputs
    document.getElementById('productSearch').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchProducts();
    });
    
    document.getElementById('salesSearch').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchSales();
    });
    
    document.getElementById('inventorySearch').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchInventory();
    });
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Dashboard functions
function loadDashboardStats() {
    document.getElementById('totalProducts').textContent = products.length;
    
    // Count low stock items
    const lowStockItems = products.filter(product => product.stock_quantity < product.min_stock);
    document.getElementById('lowStock').textContent = lowStockItems.length;
    
    // Calculate today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(sale => sale.date === today);
    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    document.getElementById('todaySales').textContent = '$' + todayTotal.toFixed(2);
    
    // Calculate monthly revenue
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === thisMonth && saleDate.getFullYear() === thisYear;
    });
    const monthTotal = monthSales.reduce((sum, sale) => sum + sale.total, 0);
    document.getElementById('monthlyRevenue').textContent = '$' + monthTotal.toFixed(2);
}

function loadActivityLog() {
    const activityLog = document.getElementById('activityLog');
    activityLog.innerHTML = '';
    
    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${activity.date}</td>
            <td>${activity.activity}</td>
            <td>${activity.user}</td>
            <td>${activity.details}</td>
        `;
        activityLog.appendChild(row);
    });
}

// Products functions
function loadProductTable() {
    const productTable = document.getElementById('productTable');
    productTable.innerHTML = '';
    
    products.forEach(product => {
        const status = getStockStatus(product.stock_quantity, product.min_stock);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.product_id}</td>
            <td>${product.product_name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock_quantity}</td>
            <td><span class="badge ${status.class}">${status.text}</span></td>
            <td>
                <button class="btn btn-primary" onclick="showEditProduct(${product.product_id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.product_id})">Delete</button>
            </td>
        `;
        productTable.appendChild(row);
    });
}

function handleAddProduct(e) {
    e.preventDefault();
    
    // Get form values
    const productName = document.getElementById('productName').value;
    const category = document.getElementById('category').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Create new product object
    const newProduct = {
        product_id: products.length > 0 ? Math.max(...products.map(p => p.product_id)) + 1 : 1,
        product_name: productName,
        category: category,
        price: price,
        stock_quantity: quantity,
        min_stock: Math.ceil(quantity * 0.2), // Set default min stock at 20% of initial quantity
        last_updated: new Date().toISOString().split('T')[0]
    };
    
    // Add to products array
    products.push(newProduct);
    
    // Add activity log
    addActivity(`New Product`, `Added ${productName} to inventory`);
    
    // Refresh product table and dropdowns
    loadProductTable();
    loadProductDropdowns();
    loadDashboardStats();
    
    // Reset form
    document.getElementById('addProductForm').reset();
    
    // Show success message
    alert(`Product "${productName}" has been added successfully.`);
}

function showEditProduct(productId) {
    // Find the product
    const product = products.find(p => p.product_id === productId);
    if (!product) return;
    
    // Fill the edit form
    document.getElementById('editProductId').value = product.product_id;
    document.getElementById('editProductName').value = product.product_name;
    document.getElementById('editCategory').value = product.category;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editMinStock').value = product.min_stock;
    
    // Show the modal
    openModal('editModal');
}

function handleEditProduct(e) {
    e.preventDefault();
    
    // Get form values
    const productId = parseInt(document.getElementById('editProductId').value);
    const productName = document.getElementById('editProductName').value;
    const category = document.getElementById('editCategory').value;
    const price = parseFloat(document.getElementById('editPrice').value);
    const minStock = parseInt(document.getElementById('editMinStock').value);
    
    // Find the product index
    const productIndex = products.findIndex(p => p.product_id === productId);
    if (productIndex === -1) return;
    
    // Update the product
    products[productIndex].product_name = productName;
    products[productIndex].category = category;
    products[productIndex].price = price;
    products[productIndex].min_stock = minStock;
    products[productIndex].last_updated = new Date().toISOString().split('T')[0];
    
    // Add activity log
    addActivity(`Product Update`, `Updated ${productName} information`);
    
    // Refresh tables and dropdowns
    loadProductTable();
    loadProductDropdowns();
    loadInventoryTable();
    loadSalesTable();
    
    // Close the modal
    closeModal('editModal');
    
    // Show success message
    alert(`Product "${productName}" has been updated successfully.`);
}

function deleteProduct(productId) {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
        return;
    }
    
    // Find the product
    const product = products.find(p => p.product_id === productId);
    if (!product) return;
    
    // Add activity log
    addActivity(`Product Deletion`, `Removed ${product.product_name} from inventory`);
    
    // Remove from products array
    products = products.filter(p => p.product_id !== productId);
    
    // Refresh tables and dropdowns
    loadProductTable();
    loadProductDropdowns();
    loadDashboardStats();
    
    // Show success message
    alert(`Product "${product.product_name}" has been deleted successfully.`);
}

function searchProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    
    const filteredProducts = products.filter(product => 
        product.product_name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    const productTable = document.getElementById('productTable');
    productTable.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const status = getStockStatus(product.stock_quantity, product.min_stock);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.product_id}</td>
            <td>${product.product_name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock_quantity}</td>
            <td><span class="badge ${status.class}">${status.text}</span></td>
            <td>
                <button class="btn btn-primary" onclick="showEditProduct(${product.product_id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.product_id})">Delete</button>
            </td>
        `;
        productTable.appendChild(row);
    });
}

// Sales functions
function loadSalesTable() {
    const salesTable = document.getElementById('salesTable');
    salesTable.innerHTML = '';
    
    // Sort sales by date (newest first)
    const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedSales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.sale_id}</td>
            <td>${sale.date}</td>
            <td>${sale.product_name}</td>
            <td>${sale.quantity}</td>
            <td>$${sale.total.toFixed(2)}</td>
            <td>${sale.customer}</td>
            <td>
                <button class="btn btn-primary" onclick="viewSaleDetails(${sale.sale_id})">View</button>
                <button class="btn btn-danger" onclick="deleteSale(${sale.sale_id})">Delete</button>
            </td>
        `;
        salesTable.appendChild(row);
    });
}

function handleAddSale(e) {
    e.preventDefault();
    
    // Get form values
    const productId = parseInt(document.getElementById('saleProduct').value);
    const quantity = parseInt(document.getElementById('saleQuantity').value);
    const date = document.getElementById('saleDate').value;
    const customer = document.getElementById('customer').value;
    
    // Find the product
    const product = products.find(p => p.product_id === productId);
    if (!product) return;
    
    // Check if enough stock is available
    if (quantity > product.stock_quantity) {
        alert(`Not enough stock available. Only ${product.stock_quantity} units of ${product.product_name} in stock.`);
        return;
    }
    
    // Calculate total
    const total = product.price * quantity;
    
    // Create new sale object
    const newSale = {
        sale_id: sales.length > 0 ? Math.max(...sales.map(s => s.sale_id)) + 1 : 1,
        date: date,
        product_id: productId,
        product_name: product.product_name,
        quantity: quantity,
        total: total,
        customer: customer
    };
    
    // Add to sales array
    sales.push(newSale);
    
    // Update product stock
    const productIndex = products.findIndex(p => p.product_id === productId);
    if (productIndex !== -1) {
        products[productIndex].stock_quantity -= quantity;
        products[productIndex].last_updated = date;
    }
    
    // Add activity log
    addActivity(`Sale`, `Sold ${quantity} ${product.product_name} to ${customer}`);
    
    // Refresh tables and stats
    loadSalesTable();
    loadInventoryTable();
    loadProductTable();
    loadDashboardStats();
    
    // Reset form
    document.getElementById('addSaleForm').reset();
    document.getElementById('saleDate').valueAsDate = new Date();
    
    // Show success message
    alert(`Sale recorded successfully. Total: $${total.toFixed(2)}`);
}

function viewSaleDetails(saleId) {
    // Find the sale
    const sale = sales.find(s => s.sale_id === saleId);
    if (!sale) return;
    
    // Show details in an alert for now (could be improved with a modal)
    alert(`
        Sale ID: ${sale.sale_id}
        Date: ${sale.date}
        Product: ${sale.product_name}
        Quantity: ${sale.quantity}
        Price per unit: $${(sale.total / sale.quantity).toFixed(2)}
        Total: $${sale.total.toFixed(2)}
        Customer: ${sale.customer}
    `);
}

function deleteSale(saleId) {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this sale record? This action cannot be undone.")) {
        return;
    }
    
    // Find the sale
    const sale = sales.find(s => s.sale_id === saleId);
    if (!sale) return;
    
    // Update product stock (restore the sold quantity)
    const productIndex = products.findIndex(p => p.product_id === sale.product_id);
    if (productIndex !== -1) {
        products[productIndex].stock_quantity += sale.quantity;
        products[productIndex].last_updated = new Date().toISOString().split('T')[0];
    }
    
    // Add activity log
    addActivity(`Sale Deletion`, `Removed sale of ${sale.quantity} ${sale.product_name} to ${sale.customer}`);
    
    // Remove from sales array
    sales = sales.filter(s => s.sale_id !== saleId);
    
    // Refresh tables and stats
    loadSalesTable();
    loadInventoryTable();
    loadProductTable();
    loadDashboardStats();
    
    // Show success message
    alert(`Sale record has been deleted successfully.`);
}

function searchSales() {
    const searchTerm = document.getElementById('salesSearch').value.toLowerCase();
    
    const filteredSales = sales.filter(sale => 
        sale.product_name.toLowerCase().includes(searchTerm) ||
        sale.customer.toLowerCase().includes(searchTerm) ||
        sale.date.includes(searchTerm)
    );
    
    const salesTable = document.getElementById('salesTable');
    salesTable.innerHTML = '';
    
    filteredSales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.sale_id}</td>
            <td>${sale.date}</td>
            <td>${sale.product_name}</td>
            <td>${sale.quantity}</td>
            <td>$${sale.total.toFixed(2)}</td>
            <td>${sale.customer}</td>
            <td>
                <button class="btn btn-primary" onclick="viewSaleDetails(${sale.sale_id})">View</button>
                <button class="btn btn-danger" onclick="deleteSale(${sale.sale_id})">Delete</button>
            </td>
        `;
        salesTable.appendChild(row);
    });
}

// Inventory functions
function loadInventoryTable() {
    const inventoryTable = document.getElementById('inventoryTable');
    inventoryTable.innerHTML = '';
    
    products.forEach(product => {
        const status = getStockStatus(product.stock_quantity, product.min_stock);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.product_name}</td>
            <td>${product.stock_quantity}</td>
            <td>${product.min_stock}</td>
            <td>${product.last_updated}</td>
            <td><span class="badge ${status.class}">${status.text}</span></td>
            <td>
                <button class="btn btn-primary" onclick="showUpdateStock(${product.product_id})">Update Stock</button>
            </td>
        `;
        inventoryTable.appendChild(row);
    });
}

function showUpdateStock(productId) {
    // Find the product
    const product = products.find(p => p.product_id === productId);
    if (!product) return;
    
    // Set the product in the update form
    const updateProduct = document.getElementById('updateProduct');
    updateProduct.value = product.product_id;
    
    // Show the quantity
    document.getElementById('updateQuantity').value = product.stock_quantity;
    
    // Scroll to the update form
    document.getElementById('updateStockForm').scrollIntoView({ behavior: 'smooth' });
}

function handleUpdateStock(e) {
    e.preventDefault();
    
    // Get form values
    const productId = parseInt(document.getElementById('updateProduct').value);
    const newQuantity = parseInt(document.getElementById('updateQuantity').value);
    const reason = document.getElementById('updateReason').value;
    
    // Find the product
    const product = products.find(p => p.product_id === productId);
    if (!product) return;
    
    // Get quantity change
    const quantityChange = newQuantity - product.stock_quantity;
    const reasonText = {
        'restock': 'Restocking',
        'adjustment': 'Inventory Adjustment',
        'damaged': 'Damaged/Expired'
    }[reason] || reason;
    
    // Update the product
    product.stock_quantity = newQuantity;
    product.last_updated = new Date().toISOString().split('T')[0];
    
    // Add activity log
    let changeText = quantityChange > 0 ? `increased by ${quantityChange}` : 
                    quantityChange < 0 ? `decreased by ${Math.abs(quantityChange)}` : 
                    `unchanged`;
    
    addActivity(`Stock Update`, `${product.product_name} stock ${changeText} due to ${reasonText}`);
    
    // Refresh tables and stats
    loadInventoryTable();
    loadProductTable();
    loadDashboardStats();
    
    // Reset form
    document.getElementById('updateStockForm').reset();
    
    // Show success message
    alert(`${product.product_name} stock updated successfully to ${newQuantity} units.`);
}

function searchInventory() {
    const searchTerm = document.getElementById('inventorySearch').value.toLowerCase();
    
    const filteredProducts = products.filter(product => 
        product.product_name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    const inventoryTable = document.getElementById('inventoryTable');
    inventoryTable.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const status = getStockStatus(product.stock_quantity, product.min_stock);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.product_name}</td>
            <td>${product.stock_quantity}</td>
            <td>${product.min_stock}</td>
            <td>${product.last_updated}</td>
            <td><span class="badge ${status.class}">${status.text}</span></td>
            <td>
                <button class="btn btn-primary" onclick="showUpdateStock(${product.product_id})">Update Stock</button>
            </td>
        `;
        inventoryTable.appendChild(row);
    });
}

// Reports functions
function loadReportsTable() {
    const reportsTable = document.getElementById('reportsTable');
    reportsTable.innerHTML = '';
    
    reports.forEach((report, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${report.name}</td>
            <td>${report.type}</td>
            <td>${report.date_range}</td>
            <td>${report.generated}</td>
            <td>
                <button class="btn btn-primary" onclick="viewReport(${index})">View</button>
                <button class="btn btn-danger" onclick="deleteReport(${index})">Delete</button>
            </td>
        `;
        reportsTable.appendChild(row);
    });
}

function handleGenerateReport(e) {
    e.preventDefault();
    
    // Get form values
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Format date range for display
    const startFormatted = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const endFormatted = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dateRange = `${startFormatted} - ${endFormatted}`;
    
    // Generate report name based on type
    let reportName = '';
    switch(reportType) {
        case 'sales':
            reportName = 'Sales Report';
            break;
        case 'inventory':
            reportName = 'Inventory Status Report';
            break;
        case 'low-stock':
            reportName = 'Low Stock Items Report';
            break;
        case 'profit':
            reportName = 'Profit Analysis Report';
            break;
        default:
            reportName = 'Custom Report';
    }
    
    // Create new report object
    const newReport = {
        name: reportName,
        type: document.getElementById('reportType').options[document.getElementById('reportType').selectedIndex].text,
        date_range: dateRange,
        generated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    // Add to reports array
    reports.push(newReport);
    
    // Add activity log
    addActivity(`Report Generation`, `Generated ${reportName} for ${dateRange}`);
    
    // Refresh reports table
    loadReportsTable();
    
    // Show success message
    alert(`${reportName} has been generated successfully.`);
    
    // Show the report
    viewReport(reports.length - 1);
}

function viewReport(reportIndex) {
    const report = reports[reportIndex];
    if (!report) return;
    
    // In a real application, this would generate and show a detailed report
    // For demo purposes, we'll just show a simple alert with the report information
    alert(`
        Report: ${report.name}
        Type: ${report.type}
        Period: ${report.date_range}
        Generated on: ${report.generated}
        
        This is a placeholder for the detailed report content.
        In a real application, this would show tables, charts, and analysis based on the report type.
    `);
}

function deleteReport(reportIndex) {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
        return;
    }
    
    // Get the report
    const report = reports[reportIndex];
    if (!report) return;
    
    // Add activity log
    addActivity(`Report Deletion`, `Removed ${report.name} from reports`);
    
    // Remove from reports array
    reports.splice(reportIndex, 1);
    
    // Refresh reports table
    loadReportsTable();
    
    // Show success message
    alert(`Report has been deleted successfully.`);
}

// Utility functions
function getStockStatus(quantity, minStock) {
    if (quantity <= 0) {
        return { text: 'Out of Stock', class: 'badge-danger' };
    } else if (quantity < minStock) {
        return { text: 'Low Stock', class: 'badge-warning' };
    } else {
        return { text: 'In Stock', class: 'badge-success' };
    }
}

function addActivity(activity, details) {
    // Create new activity object
    const newActivity = {
        date: new Date().toISOString().split('T')[0],
        activity: activity,
        user: 'Admin',
        details: details
    };
    
    // Add to activities array at the beginning
    activities.unshift(newActivity);
    
    // Keep only the last 20 activities
    if (activities.length > 20) {
        activities.pop();
    }
    
    // Refresh activity log
    loadActivityLog();
}

function loadProductDropdowns() {
    // Get all product dropdowns
    const dropdowns = ['saleProduct', 'updateProduct'];
    
    dropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        
        // Save selected value
        const selectedValue = dropdown.value;
        
        // Clear options except the first one
        while (dropdown.options.length > 1) {
            dropdown.remove(1);
        }
        
        // Add product options
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.product_id;
            option.textContent = `${product.product_name} ($${product.price.toFixed(2)})`;
            dropdown.appendChild(option);
        });
        
        // Restore selected value if possible
        if (selectedValue) {
            dropdown.value = selectedValue;
        }
    });
}