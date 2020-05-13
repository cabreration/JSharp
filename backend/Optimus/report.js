class Report {
    
    static changes = [];

    static restart() {
        Report.changes = [];
    }
}

module.exports.Report = Report;