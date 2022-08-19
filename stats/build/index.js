"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MatchReader_1 = require("./MatchReader");
const CsvFileReader_1 = require("./CsvFileReader");
const Summary_1 = require("./Summary");
const WinsAnalysis_1 = require("./analyzers/WinsAnalysis");
const HtmlReport_1 = require("./reporters/HtmlReport");
const csvFileReader = new CsvFileReader_1.CsvFileReader('football.csv');
const matchReader = new MatchReader_1.MatchReader(csvFileReader);
matchReader.load();
// Not good approach
// const homeWin = "H";
// const awayWin = "A";
// const draw = "D";
//here can be used static methods f.e. Summary.winsAnalysisWithHtmlReport('team name here!')
const summary = new Summary_1.Summary(new WinsAnalysis_1.WinsAnalysis('Liverpool'), new HtmlReport_1.HtmlReport());
summary.buildAndPrintReport(matchReader.matches);
