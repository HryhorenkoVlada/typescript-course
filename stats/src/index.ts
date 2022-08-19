import { MatchResult } from './MatchResult';
import {MatchReader} from './MatchReader';
import { CsvFileReader } from './CsvFileReader';
import { Summary } from './Summary';
import { WinsAnalysis } from './analyzers/WinsAnalysis';
import { ConsoleReport } from './reporters/ConsoleReport';
import { HtmlReport } from './reporters/HtmlReport';

const csvFileReader = new CsvFileReader('football.csv');
const matchReader = new MatchReader(csvFileReader)
matchReader.load();

// Not good approach
// const homeWin = "H";
// const awayWin = "A";
// const draw = "D";

//here can be used static methods f.e. Summary.winsAnalysisWithHtmlReport('team name here!')
const summary = new Summary(new WinsAnalysis('Liverpool'), new HtmlReport());

summary.buildAndPrintReport(matchReader.matches);
