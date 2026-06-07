import axios, { AxiosResponse } from "axios";
import {
  CompanyBalanceSheet,
  CompanyIncomeStatement,
  CompanyCompData,
  CompanyCashFlow,
  CompanyKeyMetrics,
  CompanyProfile,
  CompanySearch,
  CompanyTenK,
  CompanyHistoricalDividend,
} from "./company";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_TOKEN =
  process.env.REACT_APP_FINNHUB_KEY ?? process.env.REACT_APP_API_KEY;

type FinnhubProfile = {
  country?: string;
  currency?: string;
  exchange?: string;
  finnhubIndustry?: string;
  ipo?: string;
  logo?: string;
  marketCapitalization?: number;
  name?: string;
  phone?: string;
  ticker?: string;
  weburl?: string;
};

type FinnhubQuote = {
  c?: number;
  d?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
};

type FinnhubSearchResult = {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
};

type FinnhubFinancialLine = {
  concept?: string;
  label?: string;
  value?: number;
};

type FinnhubFinancialReport = {
  year?: number;
  quarter?: number;
  report?: {
    bs?: FinnhubFinancialLine[];
    cf?: FinnhubFinancialLine[];
    ic?: FinnhubFinancialLine[];
  };
};

const withFinnhubToken = (path: string) => {
  const separator = path.includes("?") ? "&" : "?";
  return `${FINNHUB_BASE_URL}${path}${separator}token=${FINNHUB_TOKEN}`;
};

const responseWithData = <T,>(response: AxiosResponse, data: T) => ({
  ...response,
  data,
});

const num = (value: unknown) => (typeof value === "number" ? value : 0);

const findFinancialValue = (
  lines: FinnhubFinancialLine[] | undefined,
  ...names: string[]
) => {
  const normalizedNames = names.map((name) => name.toLowerCase());
  const line = lines?.find((item) => {
    const concept = item.concept?.toLowerCase() ?? "";
    const label = item.label?.toLowerCase() ?? "";
    return normalizedNames.some(
      (name) => concept.includes(name) || label.includes(name)
    );
  });

  return num(line?.value);
};

const mapProfile = (
  profile: FinnhubProfile,
  quote: FinnhubQuote
): CompanyProfile => ({
  symbol: profile.ticker ?? "",
  price: num(quote.c),
  beta: 0,
  volAvg: 0,
  mktCap: num(profile.marketCapitalization) * 1_000_000,
  lastDiv: 0,
  range: `${num(quote.l)}-${num(quote.h)}`,
  changes: num(quote.d),
  companyName: profile.name ?? "",
  currency: profile.currency ?? "",
  cik: "",
  isin: "",
  exchange: profile.exchange ?? "",
  exchangeShortName: profile.exchange ?? "",
  industry: profile.finnhubIndustry ?? "",
  website: profile.weburl ?? "",
  description: "",
  ceo: "",
  sector: profile.finnhubIndustry ?? "",
  counter: profile.country ?? "",
  fullTimeEmployees: "",
  phone: profile.phone ?? "",
  address: "",
  city: "",
  state: "",
  zip: "",
  dcfDiff: 0,
  dcf: 0,
  image: profile.logo ?? "",
  ipoDate: profile.ipo ?? "",
  defaultImage: false,
  isEtf: false,
  isActivelyTrading: true,
  isAdr: false,
  isFund: false,
});

const mapMetrics = (metric: Record<string, number>): CompanyKeyMetrics => ({
  revenuePerShareTTM: num(metric.revenuePerShareTTM),
  netIncomePerShareTTM: num(metric.netIncomePerShareTTM),
  operatingCashFlowPerShareTTM: num(metric.operatingCashFlowPerShareTTM),
  freeCashFlowPerShareTTM: num(metric.freeCashFlowPerShareTTM),
  cashPerShareTTM: num(metric.cashPerShareTTM),
  bookValuePerShareTTM: num(metric.bookValuePerShareAnnual),
  tangibleBookValuePerShareTTM: num(metric.tangibleBookValuePerShareAnnual),
  shareholdersEquityPerShareTTM: num(metric.bookValuePerShareAnnual),
  interestDebtPerShareTTM: 0,
  marketCapTTM: num(metric.marketCapitalization) * 1_000_000,
  enterpriseValueTTM: num(metric.enterpriseValue),
  peRatioTTM: num(metric.peBasicExclExtraTTM),
  priceToSalesRatioTTM: num(metric.psTTM),
  pocfratioTTM: num(metric.pcfShareTTM),
  pfcfRatioTTM: num(metric.pfcfShareTTM),
  pbRatioTTM: num(metric.pbAnnual),
  ptbRatioTTM: num(metric.ptbvAnnual),
  evToSalesTTM: num(metric.evToSalesTTM),
  enterpriseValueOverEBITDATTM: num(metric.evToEbitdaTTM),
  evToOperatingCashFlowTTM: 0,
  evToFreeCashFlowTTM: 0,
  earningsYieldTTM: 0,
  freeCashFlowYieldTTM: 0,
  debtToEquityTTM: num(metric.totalDebtToEquityAnnual),
  debtToAssetsTTM: 0,
  netDebtToEBITDATTM: 0,
  currentRatioTTM: num(metric.currentRatioAnnual),
  interestCoverageTTM: 0,
  incomeQualityTTM: 0,
  dividendYieldTTM: num(metric.currentDividendYieldTTM),
  dividendYieldPercentageTTM: num(metric.currentDividendYieldTTM),
  payoutRatioTTM: num(metric.payoutRatioTTM),
  salesGeneralAndAdministrativeToRevenueTTM: 0,
  researchAndDevelopementToRevenueTTM: 0,
  intangiblesToTotalAssetsTTM: 0,
  capexToOperatingCashFlowTTM: 0,
  capexToRevenueTTM: 0,
  capexToDepreciationTTM: 0,
  stockBasedCompensationToRevenueTTM: 0,
  grahamNumberTTM: 0,
  roicTTM: num(metric.roicTTM),
  returnOnTangibleAssetsTTM: num(metric.roaTTM),
  grahamNetNetTTM: 0,
  workingCapitalTTM: 0,
  tangibleAssetValueTTM: 0,
  netCurrentAssetValueTTM: 0,
  investedCapitalTTM: 0,
  averageReceivablesTTM: 0,
  averagePayablesTTM: 0,
  averageInventoryTTM: 0,
  daysSalesOutstandingTTM: 0,
  daysPayablesOutstandingTTM: 0,
  daysOfInventoryOnHandTTM: 0,
  receivablesTurnoverTTM: 0,
  payablesTurnoverTTM: 0,
  inventoryTurnoverTTM: 0,
  roeTTM: num(metric.roeTTM),
  capexPerShareTTM: num(metric.capexPerShareTTM),
  dividendPerShareTTM: num(metric.dividendPerShareTTM),
  debtToMarketCapTTM: 0,
});

const mapIncomeStatement = (
  report: FinnhubFinancialReport,
  symbol: string
): CompanyIncomeStatement => {
  const lines = report.report?.ic;
  const revenue = findFinancialValue(lines, "revenue", "sales");
  const grossProfit = findFinancialValue(lines, "gross profit");
  const operatingIncome = findFinancialValue(lines, "operating income");
  const incomeBeforeTax = findFinancialValue(lines, "income before tax");
  const netIncome = findFinancialValue(lines, "net income");

  return {
    date: report.year?.toString() ?? "",
    symbol,
    reportedCurrency: "",
    cik: "",
    fillingDate: "",
    acceptedDate: "",
    calendarYear: report.year?.toString() ?? "",
    period: report.quarter ? `Q${report.quarter}` : "FY",
    revenue,
    costOfRevenue: findFinancialValue(lines, "cost of revenue", "cost of goods"),
    grossProfit,
    grossProfitRatio: revenue ? grossProfit / revenue : 0,
    researchAndDevelopmentExpenses: findFinancialValue(lines, "research"),
    generalAndAdministrativeExpenses: findFinancialValue(lines, "general"),
    sellingAndMarketingExpenses: findFinancialValue(lines, "selling"),
    sellingGeneralAndAdministrativeExpenses: findFinancialValue(lines, "selling general"),
    otherExpenses: 0,
    operatingExpenses: findFinancialValue(lines, "operating expenses"),
    costAndExpenses: 0,
    interestIncome: findFinancialValue(lines, "interest income"),
    interestExpense: findFinancialValue(lines, "interest expense"),
    depreciationAndAmortization: findFinancialValue(lines, "depreciation", "amortization"),
    ebitda: 0,
    ebitdaratio: 0,
    operatingIncome,
    operatingIncomeRatio: revenue ? operatingIncome / revenue : 0,
    totalOtherIncomeExpensesNet: 0,
    incomeBeforeTax,
    incomeBeforeTaxRatio: revenue ? incomeBeforeTax / revenue : 0,
    incomeTaxExpense: findFinancialValue(lines, "income tax"),
    netIncome,
    netIncomeRatio: revenue ? netIncome / revenue : 0,
    eps: findFinancialValue(lines, "earnings per share basic", "basic earnings per share"),
    epsdiluted: findFinancialValue(lines, "earnings per share diluted", "diluted earnings per share"),
    weightedAverageShsOut: findFinancialValue(lines, "weighted average shares"),
    weightedAverageShsOutDil: 0,
    link: "",
    finalLink: "",
  };
};

const mapBalanceSheet = (
  report: FinnhubFinancialReport,
  symbol: string
): CompanyBalanceSheet => {
  const lines = report.report?.bs;

  return {
    date: report.year?.toString() ?? "",
    symbol,
    reportedCurrency: "",
    cik: "",
    fillingDate: "",
    acceptedDate: "",
    calendarYear: report.year?.toString() ?? "",
    period: report.quarter ? `Q${report.quarter}` : "FY",
    cashAndCashEquivalents: findFinancialValue(lines, "cash and cash equivalents"),
    shortTermInvestments: findFinancialValue(lines, "short term investments"),
    cashAndShortTermInvestments: findFinancialValue(lines, "cash and short term investments"),
    netReceivables: findFinancialValue(lines, "accounts receivable", "receivables"),
    inventory: findFinancialValue(lines, "inventory"),
    otherCurrentAssets: findFinancialValue(lines, "other current assets"),
    totalCurrentAssets: findFinancialValue(lines, "current assets"),
    propertyPlantEquipmentNet: findFinancialValue(lines, "property plant", "equipment"),
    goodwill: findFinancialValue(lines, "goodwill"),
    intangibleAssets: findFinancialValue(lines, "intangible"),
    goodwillAndIntangibleAssets: 0,
    longTermInvestments: findFinancialValue(lines, "long term investments"),
    taxAssets: findFinancialValue(lines, "tax assets"),
    otherNonCurrentAssets: findFinancialValue(lines, "other non-current assets"),
    totalNonCurrentAssets: findFinancialValue(lines, "non-current assets"),
    otherAssets: findFinancialValue(lines, "other assets"),
    totalAssets: findFinancialValue(lines, "total assets"),
    accountPayables: findFinancialValue(lines, "accounts payable"),
    shortTermDebt: findFinancialValue(lines, "short term debt"),
    taxPayables: findFinancialValue(lines, "tax payable"),
    deferredRevenue: findFinancialValue(lines, "deferred revenue"),
    otherCurrentLiabilities: findFinancialValue(lines, "other current liabilities"),
    totalCurrentLiabilities: findFinancialValue(lines, "current liabilities"),
    longTermDebt: findFinancialValue(lines, "long term debt"),
    deferredRevenueNonCurrent: 0,
    deferredTaxLiabilitiesNonCurrent: findFinancialValue(lines, "deferred tax liabilities"),
    otherNonCurrentLiabilities: findFinancialValue(lines, "other non-current liabilities"),
    totalNonCurrentLiabilities: findFinancialValue(lines, "non-current liabilities"),
    otherLiabilities: findFinancialValue(lines, "other liabilities"),
    capitalLeaseObligations: findFinancialValue(lines, "lease obligations"),
    totalLiabilities: findFinancialValue(lines, "total liabilities"),
    preferredStock: findFinancialValue(lines, "preferred stock"),
    commonStock: findFinancialValue(lines, "common stock"),
    retainedEarnings: findFinancialValue(lines, "retained earnings"),
    accumulatedOtherComprehensiveIncomeLoss: 0,
    othertotalStockholdersEquity: 0,
    totalStockholdersEquity: findFinancialValue(lines, "stockholders equity", "shareholders equity"),
    totalEquity: findFinancialValue(lines, "total equity"),
    totalLiabilitiesAndStockholdersEquity: findFinancialValue(lines, "liabilities and stockholders equity"),
    minorityInterest: findFinancialValue(lines, "minority interest"),
    totalLiabilitiesAndTotalEquity: 0,
    totalInvestments: findFinancialValue(lines, "total investments"),
    totalDebt: findFinancialValue(lines, "total debt"),
    netDebt: findFinancialValue(lines, "net debt"),
    link: "",
    finalLink: "",
  };
};

const mapCashFlow = (
  report: FinnhubFinancialReport,
  symbol: string
): CompanyCashFlow => {
  const lines = report.report?.cf;
  const operatingCashFlow = findFinancialValue(lines, "operating cash");
  const capitalExpenditure = findFinancialValue(lines, "capital expenditure");

  return {
    date: report.year?.toString() ?? "",
    symbol,
    reportedCurrency: "",
    cik: "",
    fillingDate: "",
    acceptedDate: "",
    calendarYear: report.year?.toString() ?? "",
    period: report.quarter ? `Q${report.quarter}` : "FY",
    netIncome: findFinancialValue(lines, "net income"),
    depreciationAndAmortization: findFinancialValue(lines, "depreciation", "amortization"),
    deferredIncomeTax: findFinancialValue(lines, "deferred income tax"),
    stockBasedCompensation: findFinancialValue(lines, "stock based compensation"),
    changeInWorkingCapital: findFinancialValue(lines, "working capital"),
    accountsReceivables: findFinancialValue(lines, "accounts receivable"),
    inventory: findFinancialValue(lines, "inventory"),
    accountsPayables: findFinancialValue(lines, "accounts payable"),
    otherWorkingCapital: 0,
    otherNonCashItems: findFinancialValue(lines, "non cash"),
    netCashProvidedByOperatingActivities: operatingCashFlow,
    investmentsInPropertyPlantAndEquipment: capitalExpenditure,
    acquisitionsNet: findFinancialValue(lines, "acquisitions"),
    purchasesOfInvestments: findFinancialValue(lines, "purchases of investments"),
    salesMaturitiesOfInvestments: findFinancialValue(lines, "sales of investments"),
    otherInvestingActivites: 0,
    netCashUsedForInvestingActivites: findFinancialValue(lines, "investing cash"),
    debtRepayment: findFinancialValue(lines, "debt repayment"),
    commonStockIssued: findFinancialValue(lines, "common stock issued"),
    commonStockRepurchased: findFinancialValue(lines, "repurchase"),
    dividendsPaid: findFinancialValue(lines, "dividends paid"),
    otherFinancingActivites: 0,
    netCashUsedProvidedByFinancingActivities: findFinancialValue(lines, "financing cash"),
    effectOfForexChangesOnCash: findFinancialValue(lines, "foreign exchange"),
    netChangeInCash: findFinancialValue(lines, "net change in cash"),
    cashAtEndOfPeriod: findFinancialValue(lines, "cash at end"),
    cashAtBeginningOfPeriod: findFinancialValue(lines, "cash at beginning"),
    operatingCashFlow,
    capitalExpenditure,
    freeCashFlow: operatingCashFlow + capitalExpenditure,
    link: "",
    finalLink: "",
  };
};

export interface SearchResponse {
  data: CompanySearch[];
}

export const searchCompanies = async (query: string) => {
  try {
    const response = await axios.get<{
      result: FinnhubSearchResult[];
    }>(withFinnhubToken(`/search?q=${query}`));
    return response.data.result.map((item) => ({
      currency: "",
      exchangeShortName: item.type,
      name: item.description,
      stockExchange: "",
      symbol: item.symbol || item.displaySymbol,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An expected error has occured.";
    }
  }
};

export const getCompanyProfile = async (query: string) => {
  try {
    const [profileResponse, quoteResponse] = await Promise.all([
      axios.get<FinnhubProfile>(withFinnhubToken(`/stock/profile2?symbol=${query}`)),
      axios.get<FinnhubQuote>(withFinnhubToken(`/quote?symbol=${query}`)),
    ]);

    return responseWithData<CompanyProfile[]>(profileResponse, [
      mapProfile(profileResponse.data, quoteResponse.data),
    ]);
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};

export const getKeyMetrics = async (query: string) => {
  try {
    const response = await axios.get<{ metric: Record<string, number> }>(
      withFinnhubToken(`/stock/metric?symbol=${query}&metric=all`)
    );
    return responseWithData<CompanyKeyMetrics[]>(response, [
      mapMetrics(response.data.metric ?? {}),
    ]);
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};

export const getIncomeStatement = async (query: string) => {
  try {
    const response = await axios.get<{ financials: FinnhubFinancialReport[] }>(
      withFinnhubToken(`/stock/financials?symbol=${query}&statement=ic&freq=annual`)
    );
    const data = (response.data.financials ?? []).map((report) =>
      mapIncomeStatement(report, query)
    );
    return responseWithData<CompanyIncomeStatement[]>(response, data);
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};

export const getBalanceSheet = async (query: string) => {
  try {
    const response = await axios.get<{ financials: FinnhubFinancialReport[] }>(
      withFinnhubToken(`/stock/financials?symbol=${query}&statement=bs&freq=annual`)
    );
    const data = (response.data.financials ?? []).map((report) =>
      mapBalanceSheet(report, query)
    );
    return responseWithData<CompanyBalanceSheet[]>(response, data);
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};

export const getCashFlow = async (query: string) => {
  try {
    const response = await axios.get<{ financials: FinnhubFinancialReport[] }>(
      withFinnhubToken(`/stock/financials?symbol=${query}&statement=cf&freq=annual`)
    );
    const data = (response.data.financials ?? []).map((report) =>
      mapCashFlow(report, query)
    );
    return responseWithData<CompanyCashFlow[]>(response, data);
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};

export const getCompData = async (query: string) => {
  try {
    const response = await axios.get<string[]>(
      withFinnhubToken(`/stock/peers?symbol=${query}`)
    );
    return responseWithData<CompanyCompData[]>(response, [
      {
        symbol: query,
        peersList: response.data,
      },
    ]);
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};

export const getTenK = async (query: string) => {
  try {
    const response = await axios.get<
      {
        acceptedDate?: string;
        cik?: string;
        filedDate?: string;
        filingUrl?: string;
        form?: string;
        reportUrl?: string;
        symbol?: string;
      }[]
    >(withFinnhubToken(`/stock/filings?symbol=${query}&form=10-K`));
    const data = response.data.map((filing) => ({
      symbol: filing.symbol ?? query,
      fillingDate: filing.filedDate ?? "",
      acceptedDate: filing.acceptedDate ?? "",
      cik: filing.cik ?? "",
      type: filing.form ?? "10-K",
      link: filing.filingUrl ?? "",
      finalLink: filing.reportUrl ?? filing.filingUrl ?? "",
    }));
    return responseWithData<CompanyTenK[]>(response, data);
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};

export const getHistoricalDividend = async (query: string) => {
  try {
    const to = new Date();
    const from = new Date();
    from.setFullYear(to.getFullYear() - 30);
    const formatDate = (date: Date) => date.toISOString().slice(0, 10);
    const response = await axios.get<
      {
        adjustedAmount?: number;
        amount?: number;
        declarationDate?: string;
        exDate?: string;
        paymentDate?: string;
        recordDate?: string;
      }[]
    >(
      withFinnhubToken(
        `/stock/dividend?symbol=${query}&from=${formatDate(from)}&to=${formatDate(to)}`
      )
    );
    return responseWithData<CompanyHistoricalDividend>(response, {
      symbol: query,
      historical: response.data.map((dividend) => ({
        date: dividend.exDate ?? "",
        label: dividend.exDate ?? "",
        adjDividend: num(dividend.adjustedAmount),
        dividend: num(dividend.amount),
        recordDate: dividend.recordDate ?? "",
        paymentDate: dividend.paymentDate ?? "",
        declarationDate: dividend.declarationDate ?? "",
      })),
    });
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};
