package main

import (
	"dangerous-product-advisor/entities"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/gorilla/mux"
)

// ** CREATE USER ** //
func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user User
	json.NewDecoder(r.Body).Decode(&user)
	// send information to the database (success)
	DBInstance.Create(&user)
	w.WriteHeader(202)
	// Code for 'Accepted' when unique username
	json.NewEncoder(w).Encode(user)
}

func GetUserById(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["id"]
	var user User
	DBInstance.First(&user, userId)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	var users []User
	DBInstance.Raw("SELECT * FROM USERS").Scan(&users)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

// ** UPDATE FUNCTION ** //
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["id"]
	var user User
	DBInstance.First(&user, userId)
	json.NewDecoder(r.Body).Decode(&user)
	DBInstance.Save(&user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// ** DELETE FUNCTION ** //
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId := mux.Vars(r)["id"]
	var user User
	DBInstance.Delete(&user, userId)
	json.NewEncoder(w).Encode("User Deleted Successfully!")
}

func getDualValuesIndex(mon string, yr string) int {

	var incrementer int = 12
	var index int = 0

	yearMap := map[string]int{
		"2016": 0,
		"2017": 1,
		"2018": 2,
		"2019": 3,
		"2020": 4,
		"2021": 5,
	}

	monthMap := map[string]int{
		"1":  0,
		"2":  1,
		"3":  2,
		"4":  3,
		"5":  4,
		"6":  5,
		"7":  6,
		"8":  7,
		"9":  8,
		"10": 9,
		"11": 10,
		"12": 11,
	}

	index = monthMap[mon] + (incrementer * yearMap[yr])

	return index

}

func getYearIndex(yr string) int {

	yearMap := map[string]int{
		"2016": 0,
		"2017": 1,
		"2018": 2,
		"2019": 3,
		"2020": 4,
		"2021": 5,
	}

	return yearMap[yr]
}

func getSeasonalDualValuesIndex(season string, yr string) int {

	/*
		Seasonal format
		0 - Spring2016	4 - Spring2017	8 - Spring2018	12 - Spring2019	16 - Spring2020	20 - Spring2021
		1 - Summer2016	5 - Summer2017	9 - Summer2018	13 - Summer2019	17 - Summer2020	21 - Summer2021
		2 - Fall2016	6 - Fall2017	10 - Fall2018	14 - Fall2019	18 - Fall2020	22 - Fall2021
		3 - Winter2016	7 - Winter2017	11 - Winter2018	15 - Winter2019	19 - Winter2020	23 - Winter2021
	*/
	var incrementer int = 4
	var index int = 0
	// season + (incrementer * year)

	yearMap := map[string]int{
		"2016": 0,
		"2017": 1,
		"2018": 2,
		"2019": 3,
		"2020": 4,
		"2021": 5,
	}

	seasonMap := map[string]int{
		"Spring": 0,
		"Summer": 1,
		"Fall":   2,
		"Winter": 3,
	}

	index = seasonMap[season] + (incrementer * yearMap[yr])
	return index

}
func convertGraphDualValues(graphDualSlice []entities.GraphDualXValues) []entities.GraphDualProperXValues {

	var graphDualProper []entities.GraphDualProperXValues

	for _, i := range graphDualSlice {
		tempGraph := entities.GraphDualProperXValues{

			ProductTitle: i.ProductTitle,
			XValue:       getDualValuesIndex(i.XValue1, i.XValue2),
			YValue:       i.YValue,
		}
		graphDualProper = append(graphDualProper, tempGraph)
	}
	return graphDualProper
}

func convertGraphSeasonalDualValues(graphDualSlice []entities.GraphDualXValues) []entities.GraphDualProperXValues {

	var graphDualProper []entities.GraphDualProperXValues

	for _, i := range graphDualSlice {
		tempGraph := entities.GraphDualProperXValues{

			ProductTitle: i.ProductTitle,
			XValue:       getSeasonalDualValuesIndex(i.XValue1, i.XValue2),
			YValue:       i.YValue,
		}
		graphDualProper = append(graphDualProper, tempGraph)
	}
	return graphDualProper
}

func convertGraphSingleValues(graphSlice []entities.GraphValues) []entities.GraphProperValues {

	var graphProper []entities.GraphProperValues

	for _, i := range graphSlice {
		tempGraph := entities.GraphProperValues{

			ProductTitle: i.ProductTitle,
			XValue:       getYearIndex(i.XValue),
			YValue:       i.YValue,
		}
		graphProper = append(graphProper, tempGraph)
	}
	return graphProper
}

func convertGraphFloatValues(graphSlice []entities.GraphFloatValues) []entities.GraphFloatProperValues {

	var graphFloatProper []entities.GraphFloatProperValues

	for _, i := range graphSlice {
		tempGraph := entities.GraphFloatProperValues{

			ProductTitle: i.ProductTitle,
			XValue:       getYearIndex(i.XValue),
			YValue:       i.YValue,
		}
		graphFloatProper = append(graphFloatProper, tempGraph)
	}
	return graphFloatProper
}

func convertGraphDualValuesYFloat(graphDualSlice []entities.GraphDualXValuesYFloat) []entities.GraphDualProperXValuesYFloat {

	var graphDualProper []entities.GraphDualProperXValuesYFloat

	for _, i := range graphDualSlice {
		tempGraph := entities.GraphDualProperXValuesYFloat{

			ProductTitle: i.ProductTitle,
			XValue:       getDualValuesIndex(i.XValue1, i.XValue2),
			YValue:       i.YValue,
		}
		graphDualProper = append(graphDualProper, tempGraph)
	}
	return graphDualProper
}

func TopTwentyFive(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var graphDates []entities.GraphDates
	DBInstance.Raw(`SELECT DISTINCT EXTRACT(YEAR FROM TreatmentDate) AS year
					FROM "DENNIS.KIM".Patient
					ORDER BY year`).Scan(&graphDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	var graphValues []entities.GraphValues
	var graphProperValues []entities.GraphProperValues
	DBInstance.Raw(`SELECT Prod.Title AS product_title, 
						   EXTRACT(YEAR FROM TreatmentDate) AS x_value, 
						   COUNT(*) AS y_value
					FROM "DENNIS.KIM".Patient Pat, 
			    		 "DENNIS.KIM".InjuryInfo I, 
						 "DENNIS.KIM".Product Prod
					WHERE Pat.CASENUMBER = I.CASENUMBER
						  AND I.Product1Code = Prod.Code    
						  AND I.PRODUCT1CODE IN (SELECT PRODUCT1CODE
												 FROM (SELECT PRODUCT1CODE, COUNT(*) AS INCIDENTS
													   FROM "DENNIS.KIM".Patient P, "DENNIS.KIM".InjuryInfo I
													   WHERE P.CASENUMBER = I.CASENUMBER
													   GROUP BY PRODUCT1CODE
													   ORDER BY INCIDENTS DESC)TEMP
												 FETCH FIRST 25 ROWS ONLY)
					GROUP BY EXTRACT(YEAR FROM TreatmentDate), Prod.Title
					ORDER BY EXTRACT(YEAR FROM TreatmentDate), Prod.Title`).Scan(&graphValues)

	// Concatenate the two structs into one var
	// Copy the Label, Title, Concatenated x's, and y's into one struct
	// Send this value
	//username := r.URL.Query().Get("username")
	//password := r.URL.Query().Get("password")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	graphProperValues = convertGraphSingleValues(graphValues)
	json.NewEncoder(w).Encode(graphProperValues)
	//json.NewEncoder(w).Encode(graphValues)
}

func ConstantDangers(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var dualDates []entities.DualDates
	DBInstance.Raw(`SELECT DISTINCT EXTRACT(MONTH FROM TreatmentDate) AS month, 
						EXTRACT(YEAR FROM TreatmentDate) AS year
					FROM "DENNIS.KIM".Patient
					ORDER BY year, month`).Scan(&dualDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	var graphDualValues []entities.GraphDualXValues
	var graphDualProper []entities.GraphDualProperXValues
	DBInstance.Raw(`WITH TopFiveMonthly(Product1Code, Month, Year, Incidents, Rank) AS
					    (SELECT C.Product1Code, 
					            EXTRACT(MONTH FROM TreatmentDate) AS Month, 
					            EXTRACT(YEAR FROM TreatmentDate) AS Year, 
					            COUNT(*) AS Incidents, 
					            ROW_NUMBER() OVER (PARTITION BY EXTRACT(MONTH FROM TreatmentDate),
					                                            EXTRACT(YEAR FROM TreatmentDate) 
					                               ORDER BY EXTRACT(YEAR FROM TreatmentDate), 
					                                        EXTRACT(MONTH FROM TreatmentDate)
					                               ) AS Rank
					     FROM "DENNIS.KIM".Patient P, "DENNIS.KIM".Causes C
					     WHERE P.CaseNumber = C.CaseNumber
					     GROUP BY C.Product1Code, 
					              EXTRACT(MONTH FROM TreatmentDate),
					              EXTRACT(YEAR FROM TreatmentDate)
					     ORDER BY EXTRACT(YEAR FROM TreatmentDate) ASC, 
					              EXTRACT(MONTH FROM TreatmentDate) ASC, 
					              Incidents DESC)
					SELECT Title AS product_title, 
					       Month AS x_value1, 
					       Year AS x_value2, 
					       Incidents AS y_value
					FROM TopFiveMonthly, 
					     "DENNIS.KIM".Product
					WHERE Code = Product1Code 
					AND Product1Code IN (
					                      (SELECT Product1Code 
					                       FROM TopFiveMonthly
					                       WHERE Rank <= 5)
					                    MINUS 
					                      (SELECT Product1Code
					                       FROM TopFiveMonthly
					                       WHERE Rank > 5)
					                     )`).Scan(&graphDualValues)

	// Concatenate the two structs into one var
	// Copy the Label, Title, Concatenated x's, and y's into one struct
	// Send this value
	//username := r.URL.Query().Get("username")
	//password := r.URL.Query().Get("password")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	graphDualProper = convertGraphDualValues(graphDualValues)
	json.NewEncoder(w).Encode(graphDualProper)
}

func FatalProducts(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var graphDates []entities.GraphDates
	DBInstance.Raw(`SELECT DISTINCT EXTRACT(YEAR FROM TreatmentDate) AS year
					FROM "DENNIS.KIM".Patient
					ORDER BY year`).Scan(&graphDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	var graphFloatValues []entities.GraphFloatValues
	var graphProperFloat []entities.GraphFloatProperValues
	DBInstance.Raw(`SELECT Prod.Title AS product_title, B.Year AS x_value, ((SeriousCases / AllCases) * 100) AS y_value
					FROM "DENNIS.KIM".Product Prod,
						  (SELECT I.Product1Code AS Product, EXTRACT(YEAR FROM TreatmentDate) AS Year, COUNT(*) AS SeriousCases
						  FROM "DENNIS.KIM".Disposition D, "DENNIS.KIM".Patient P, "DENNIS.KIM".InjuryInfo I
						  WHERE D.Code = I.DispositionCode
								AND P.CaseNumber = I.CaseNumber
								AND (lower(Description) LIKE '%fatality%'
								OR lower(Description) LIKE '%hospitalized%')
								AND I.Product1Code IN (SELECT b.Product 
													   FROM (SELECT I.Product1Code AS Product, COUNT(*) AS SeriousCases
															 FROM "DENNIS.KIM".Disposition D, "DENNIS.KIM".Patient P, "DENNIS.KIM".InjuryInfo I
															 WHERE D.Code = I.DispositionCode
																   AND P.CaseNumber = I.CaseNumber
																   AND (lower(Description) LIKE '%fatality%' 
																   OR lower(Description) LIKE '%hospitalized%')
															 GROUP BY Product1Code
															 ORDER BY SeriousCases DESC) b, 
															(SELECT I.Product1Code AS Product, COUNT(*) AS AllCases
															 FROM "DENNIS.KIM".Patient P, "DENNIS.KIM".InjuryInfo I
															 WHERE P.CaseNumber = I.CaseNumber
															 GROUP BY Product1Code
															 ORDER BY AllCases DESC) a
													   WHERE b.Product = a.Product
															 AND ((SeriousCases / AllCases) * 100) > 25
															 AND AllCases > 100)
								GROUP BY Product1Code, EXTRACT(YEAR FROM TreatmentDate)
								ORDER BY Year) B,
						(SELECT I.Product1Code AS Product, EXTRACT(YEAR FROM TreatmentDate) AS Year, COUNT(*) AS AllCases
						 FROM "DENNIS.KIM".Patient P, "DENNIS.KIM".InjuryInfo I
						 WHERE P.CaseNumber = I.CaseNumber
						 GROUP BY Product1Code, EXTRACT(YEAR FROM TreatmentDate)
						 ORDER BY Year) A
					WHERE A.Product = B.Product
						  AND B.Year = A.Year
						  AND Prod.Code = B.Product`).Scan(&graphFloatValues)

	// Concatenate the two structs into one var
	// Copy the Label, Title, Concatenated x's, and y's into one struct
	// Send this value
	//username := r.URL.Query().Get("username")
	//password := r.URL.Query().Get("password")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	graphProperFloat = convertGraphFloatValues(graphFloatValues)
	json.NewEncoder(w).Encode(graphProperFloat)
	//json.NewEncoder(w).Encode(graphFloatValues)
}

func SummertimeSadness(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var graphDates []entities.GraphDates
	DBInstance.Raw(`SELECT DISTINCT EXTRACT(YEAR FROM TreatmentDate) AS year
					FROM "DENNIS.KIM".Patient
					ORDER BY year`).Scan(&graphDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	var graphFloatValues []entities.GraphFloatValues
	var graphProperFloat []entities.GraphFloatProperValues
	DBInstance.Raw(`SELECT Prod.Title AS product_title, EXTRACT(YEAR FROM T.TreatmentDate) AS x_value, COUNT(*) AS y_value
					FROM "DENNIS.KIM".Product Prod, 
						 (SELECT Product1Code, 
								 TreatmentDate,
								 CASE 
									WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0321' AND '0620' THEN 'Spring'
									WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0621' AND '0922' THEN 'Summer'
									WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0923' AND '1220' THEN 'Fall'
									ELSE 'Winter'
								 END AS Season
						  FROM "DENNIS.KIM".Patient P, "DENNIS.KIM".InjuryInfo I
						  WHERE P.CaseNumber = I.CaseNumber
								AND Product1Code IN (SELECT Product1Code 
													 FROM (SELECT Seasonal.Product1Code, Season, SeasonalTotal, OverallTotal, ((SeasonalTotal/OverallTotal) * 100) AS Percentage
														   FROM (SELECT Product1Code, Season, COUNT(*) AS SeasonalTotal
																 FROM (SELECT Product1Code, 
																			  TreatmentDate, 
																			  P.CaseNumber, 
																			  CASE 
																				WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0321' AND '0620' THEN 'Spring'
																				WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0621' AND '0922' THEN 'Summer'
																				WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0923' AND '1220' THEN 'Fall'
																				ELSE 'Winter'
																			  END AS Season
																	   FROM "DENNIS.KIM".Patient P, "DENNIS.KIM".InjuryInfo I
																	   WHERE P.CaseNumber = I.CaseNumber) 
																 GROUP BY Product1Code, Season) Seasonal, 
																(SELECT Product1Code, COUNT(*) AS OverallTotal
																 FROM "DENNIS.KIM".InjuryInfo
																 GROUP BY Product1Code) Yearly
														 WHERE Seasonal.Product1Code = Yearly.Product1Code
															   AND ((SeasonalTotal/OverallTotal) * 100) > 50
															   AND Season = 'Summer'
														ORDER BY OverallTotal DESC
														) 
													)
						) T
					WHERE T.Product1Code = Prod.Code
						  AND Season = 'Summer'
					GROUP BY Prod.Title, EXTRACT(YEAR FROM TreatmentDate)
					ORDER BY EXTRACT(YEAR FROM TreatmentDate), 
							 Prod.Title`).Scan(&graphFloatValues)

	// Concatenate the two structs into one var
	// Copy the Label, Title, Concatenated x's, and y's into one struct
	// Send this value
	//username := r.URL.Query().Get("username")
	//password := r.URL.Query().Get("password")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	graphProperFloat = convertGraphFloatValues(graphFloatValues)
	json.NewEncoder(w).Encode(graphProperFloat)
	//json.NewEncoder(w).Encode(graphFloatValues)
}

func SeasonalHazards(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var dualDates []entities.DualDates
	var graphDualProper []entities.GraphDualProperXValues
	DBInstance.Raw(`SELECT DISTINCT CASE 
										WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0321' AND '0620' THEN 'Spring'
										WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0621' AND '0922' THEN 'Summer'
										WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0923' AND '1220' THEN 'Fall'
										ELSE 'Winter'
									END AS season, 
									EXTRACT(YEAR FROM TreatmentDate) AS year
									FROM "DENNIS.KIM".Patient
									ORDER BY EXTRACT(YEAR FROM TreatmentDate), 
									 		 CASE
											 	WHEN Season = 'Winter' THEN 1
												WHEN Season = 'Spring' THEN 2
												WHEN Season = 'Summer' THEN 3
												ELSE 4
									 		 END;`).Scan(&dualDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	var graphDualValues []entities.GraphDualXValues
	DBInstance.Raw(`SELECT Prod.Title AS product_title, T.Season AS x_value1, EXTRACT(YEAR FROM T.TreatmentDate) AS x_value2, COUNT(*) AS y_value
					FROM "DENNIS.KIM".Product Prod, 
						 (SELECT Product1Code, 
								 TreatmentDate,
								 CASE 
									WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0321' AND '0620' THEN 'Spring'
									WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0621' AND '0922' THEN 'Summer'
									WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0923' AND '1220' THEN 'Fall'
									ELSE 'Winter'
								 END AS Season
						  FROM "DENNIS.KIM".Patient P, "DENNIS.KIM".InjuryInfo I
						  WHERE P.CaseNumber = I.CaseNumber
								AND Product1Code IN (SELECT Product1Code 
													 FROM (SELECT Seasonal.Product1Code, Season, SeasonalTotal, OverallTotal, ((SeasonalTotal/OverallTotal) * 100) AS Percentage
														   FROM (SELECT Product1Code, Season, COUNT(*) AS SeasonalTotal
																 FROM (SELECT Product1Code, 
																			  TreatmentDate, 
																			  P.CaseNumber, 
																			  CASE 
																				WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0321' AND '0620' THEN 'Spring'
																				WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0621' AND '0922' THEN 'Summer'
																				WHEN TO_CHAR(TreatmentDate,'MMDD') BETWEEN '0923' AND '1220' THEN 'Fall'
																				ELSE 'Winter'
																			  END AS Season
																	   FROM "DENNIS.KIM".Patient P, "DENNIS.KIM".InjuryInfo I
																	   WHERE P.CaseNumber = I.CaseNumber) 
																 GROUP BY Product1Code, Season) Seasonal, 
																(SELECT Product1Code, COUNT(*) AS OverallTotal
																 FROM "DENNIS.KIM".InjuryInfo
																 GROUP BY Product1Code) Yearly
														 WHERE Seasonal.Product1Code = Yearly.Product1Code
															   AND ((SeasonalTotal/OverallTotal) * 100) > 50
															   AND OverallTotal > 100
														ORDER BY OverallTotal DESC
														) 
													)
						) T
					WHERE T.Product1Code = Prod.Code
					GROUP BY Prod.Title, Season, EXTRACT(YEAR FROM TreatmentDate)
					ORDER BY EXTRACT(YEAR FROM TreatmentDate), 
							 CASE
								WHEN Season = 'Winter' THEN 1
								WHEN Season = 'Spring' THEN 2
								WHEN Season = 'Summer' THEN 3
								ELSE 4
							 END,
							 Prod.Title`).Scan(&graphDualValues)

	// Concatenate the two structs into one var
	// Copy the Label, Title, Concatenated x's, and y's into one struct
	// Send this value
	//username := r.URL.Query().Get("username")
	//password := r.URL.Query().Get("password")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	graphDualProper = convertGraphSeasonalDualValues(graphDualValues)
	json.NewEncoder(w).Encode(graphDualProper)
	//json.NewEncoder(w).Encode(graphDualValues)
}

func MostDangersHouseProductRog(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var dualDates []entities.DualDates
	DBInstance.Raw(`SELECT DISTINCT EXTRACT(MONTH FROM TreatmentDate) AS month, 
						EXTRACT(YEAR FROM TreatmentDate) AS year
					FROM "DENNIS.KIM".Patient
					ORDER BY year, month`).Scan(&dualDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	var graphDualValues []entities.GraphDualXValuesYFloat
	var graphDualProper []entities.GraphDualProperXValuesYFloat
	DBInstance.Raw(`WITH MDHP AS (
						SELECT
							prod.title AS product_title,
							COUNT(*) AS count,
							EXTRACT(MONTH FROM p.treatmentdate) AS MON,
							EXTRACT(YEAR FROM p.treatmentdate) AS YR
						FROM "DENNIS.KIM".patient p
						JOIN "DENNIS.KIM".injuryinfo i ON i.casenumber = p.casenumber
						LEFT JOIN "DENNIS.KIM".product prod ON i.product1code = prod.code
						WHERE product1code = 
											(
											SELECT s.product1code
											FROM 
												(
												SELECT 
													product1code, 
													COUNT(product1code)
												FROM "DENNIS.KIM".InjuryInfo
												WHERE locationcode = 1
												AND dispositioncode IN (4, 8)
												GROUP BY product1code
												ORDER BY COUNT(product1code) DESC
												FETCH FIRST 1 ROWS ONLY
												) s
											)
						AND i.locationcode = 1
						AND i.dispositioncode IN (4, 8)
						GROUP BY prod.title, EXTRACT(MONTH FROM p.treatmentdate), EXTRACT(YEAR FROM p.treatmentdate)
						ORDER BY YR ASC, MON ASC
					)
					
					SELECT
						m1.product_title,
						m1.MON AS x_value1,
						m1.YR AS x_value2, 
						((m1.count - m2.count) / m2.count * 100) AS y_value
					FROM MDHP m1
					JOIN MDHP m2 ON (m1.YR = m2.YR + 1 AND m1.MON = 1 AND m2.MON = 12) OR (m1.YR = m2.YR AND m1.MON = m2.MON + 1)
					ORDER BY m1.YR, m1.MON`).Scan(&graphDualValues)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	graphDualProper = convertGraphDualValuesYFloat(graphDualValues)
	json.NewEncoder(w).Encode(graphDualProper)
}

func TestString(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var graphDates []entities.GraphDates
	testSQLString := `SELECT year FROM(SELECT DISTINCT EXTRACT(YEAR FROM TreatmentDate) AS year
	FROM "DENNIS.KIM".Patient)`
	testSQLInput := ` WHERE year = 2016 OR year = 2017`
	testSQLInput1 := " OR year = 2018"
	combinedString := testSQLString + testSQLInput + testSQLInput1
	fmt.Println(combinedString)
	DBInstance.Raw(combinedString).Scan(&graphDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	//username := r.URL.Query().Get("username")
	//password := r.URL.Query().Get("password")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(graphDates)
}

func TestFormParsing(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(32 << 20) // maxMemory 32MB
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	//Access the age
	for key, val := range r.Form {
		fmt.Println(key, val)
	}

	ageStart := strings.Join(r.Form["ageStart"], "")
	ageEnd := strings.Join(r.Form["ageEnd"], "")
	ageString := "AND (Age BETWEEN " + ageStart + " AND " + ageEnd + ")"

	var sexMap = make(map[string]string)
	sexMap["1"] = strings.Join(r.Form["male"], "")
	sexMap["2"] = strings.Join(r.Form["female"], "")
	sexMap["0"] = strings.Join(r.Form["otherSex"], "")

	var raceMap = make(map[string]string)
	raceMap["1"] = strings.Join(r.Form["white"], "")
	raceMap["2"] = strings.Join(r.Form["black"], "")
	raceMap["4"] = strings.Join(r.Form["asian"], "")
	raceMap["5"] = strings.Join(r.Form["AI"], "")
	raceMap["6"] = strings.Join(r.Form["PI"], "")
	raceMap["3"] = strings.Join(r.Form["otherDemo"], "")

	var dispositionMap = make(map[string]string)
	dispositionMap["1"] = strings.Join(r.Form["TR"], "")
	dispositionMap["2"] = strings.Join(r.Form["hospitalized"], "")
	dispositionMap["4"] = strings.Join(r.Form["hospitalized"], "")
	dispositionMap["5"] = strings.Join(r.Form["hospitalized"], "")
	dispositionMap["6"] = strings.Join(r.Form["otherDisp"], "")
	dispositionMap["8"] = strings.Join(r.Form["fatality"], "")
	dispositionMap["9"] = strings.Join(r.Form["otherDisp"], "")

	var locationMap = make(map[string]string)
	locationMap["1"] = strings.Join(r.Form["home"], "")
	locationMap["2"] = strings.Join(r.Form["farm"], "")
	locationMap["3"] = strings.Join(r.Form["street"], "")
	locationMap["6"] = strings.Join(r.Form["MH"], "")
	locationMap["5"] = strings.Join(r.Form["city"], "")
	locationMap["8"] = strings.Join(r.Form["school"], "")
	locationMap["7"] = strings.Join(r.Form["factory"], "")
	locationMap["9"] = strings.Join(r.Form["sport"], "")
	locationMap["0"] = strings.Join(r.Form["otherLoc"], "")

	queryString := ageString
	queryString += generateStringForQuery("Sex", sexMap)
	queryString += generateStringForQuery("Race", raceMap)
	queryString += generateStringForQuery("DispositionCode", dispositionMap)
	queryString += generateStringForQuery("LocationCode", locationMap)
	fmt.Println(queryString)

	var graphValues []entities.GraphValues
	//var graphProperValues []entities.GraphProperValues
	firstThreeClauses := `SELECT Prod.Title AS product_title, EXTRACT(YEAR FROM TreatmentDate) AS x_value, 
						  	COUNT(*) AS y_value
						  FROM "DENNIS.KIM".Patient Pat, 
						    "DENNIS.KIM".InjuryInfo I, 
						    "DENNIS.KIM".Product Prod
						  WHERE Pat.CaseNumber = I.CaseNumber
						     AND I.Product1Code = Prod.Code
							 AND Title = 'FOOTWEAR' `
	lastClauses := ` GROUP BY EXTRACT(YEAR FROM TreatmentDate), Prod.Title
	ORDER BY EXTRACT(YEAR FROM TreatmentDate), Prod.Title`
	newCombinedString := firstThreeClauses + queryString + lastClauses
	DBInstance.Raw(newCombinedString).Scan(&graphValues)
	w.Header().Set("Content-Type", "application/json")
	//json.NewEncoder(w).Encode("Incorrect password")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(graphValues)
}

func generateStringForQuery(category string, someMap map[string]string) string {
	currentString := ""
	counter := 0
	for key, val := range someMap {
		if val == "true" {
			if counter == 0 {
				currentString += " AND (" + category + " = " + key
			} else {
				currentString += " OR " + category + " = " + key
			}
			counter++
		}
	}
	if counter > 0 {
		currentString += ")"
	}
	return currentString
}

func TestFormParsing1(w http.ResponseWriter, r *http.Request) {
	log.Println("Testing")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Println("r.Body", string(body))

	values, err := url.ParseQuery(string(body))
	if err != nil {
		log.Println(err)
	}
	ageStart := values.Get("ageStart")
	ageEnd := values.Get("ageEnd")
	ageString := "WHERE Age BETWEEN " + ageStart + " AND " + ageEnd
	fmt.Println(ageString)

	//Product
	//ageStart
	//ageEnd
	//male
	//female
	//otherSex
	//white
	//black
	//asian
	//aI
	//pI
	//otherDemo
	//tR
	//hospitalized
	//fatality
	//otherDisp
	//home
	//farm
	//street
	//mH
	//city
	//school
	//factory
	//sport
	//otherLoc
	//ageString :=

	//AgeStart := r.FormValue("AgeStart")
	//AgeEnd := r.FormValue("AgeEnd")
	//
	//fmt.Println("AgeStart,", AgeStart)
	//fmt.Println("AgeEnd,", AgeEnd)

	//w.Header().Set("Content-Type", "application/json")
	//var formToParse entities.FormToParse
	//json.NewDecoder(r.Body).Decode(&formToParse)
	//// send information to the database (success)
	//fmt.Println(formToParse.Product)
	//fmt.Println(formToParse.AgeStart)
	//fmt.Println(formToParse.AgeEnd)
	//fmt.Println(formToParse.Male)
	//fmt.Println(formToParse.Female)
	//fmt.Println(formToParse.OtherSex)
	//fmt.Println(formToParse.White)
	//fmt.Println(formToParse.Black)
	//fmt.Println(formToParse.Asian)
	//fmt.Println(formToParse.AI)
	//fmt.Println(formToParse.PI)
	//fmt.Println(formToParse.OtherDemo)
	//fmt.Println(formToParse.TR)
	//fmt.Println(formToParse.Hospitalized)
	//fmt.Println(formToParse.Fatality)
	//fmt.Println(formToParse.OtherDisp)
	//fmt.Println(formToParse.Home)
	//fmt.Println(formToParse.Farm)
	//fmt.Println(formToParse.Street)
	//fmt.Println(formToParse.MH)
	//fmt.Println(formToParse.City)
	//fmt.Println(formToParse.School)
	//fmt.Println(formToParse.Factory)
	//fmt.Println(formToParse.OtherLoc)
}

func YourHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Println("r.Body", string(body))
	//fmt.Println("GET params were:", r.URL.Query())
	//
	//one := r.URL.Query().Get("one")
	//fmt.Println(one)
	r.ParseForm()
	fmt.Println("one=" + r.FormValue("one"))
	fmt.Println("two=" + r.FormValue("two"))
	//fmt.Fprintf(w, ("one=" + r.FormValue("one")))
	//fmt.Fprintf(w, ("two=" + r.FormValue("two")))
	fmt.Fprintf(w, "Gorilla!\n")

	name := r.Form.Get("one")
	email := r.Form.Get("two")

	fmt.Fprintf(w, "Name: %s\n", name)
	fmt.Fprintf(w, "Email: %s\n", email)
}
