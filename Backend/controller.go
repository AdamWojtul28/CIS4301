package main

import (
	"dangerous-product-advisor/entities"
	"encoding/json"
	"net/http"

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

func TopTwentyFive(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var graphDates []entities.GraphDates
	DBInstance.Raw(`SELECT DISTINCT EXTRACT(YEAR FROM TreatmentDate) AS year
					FROM "DENNIS.KIM".Patient
					ORDER BY year`).Scan(&graphDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	var graphValues []entities.GraphValues
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
	json.NewEncoder(w).Encode(graphValues)
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
	json.NewEncoder(w).Encode(graphDualValues)
}

func FatalProducts(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var graphDates []entities.GraphDates
	DBInstance.Raw(`SELECT DISTINCT EXTRACT(YEAR FROM TreatmentDate) AS year
					FROM "DENNIS.KIM".Patient
					ORDER BY year`).Scan(&graphDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	var graphFloatValues []entities.GraphFloatValues
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
	json.NewEncoder(w).Encode(graphFloatValues)
}

func SummertimeSadness(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var graphDates []entities.GraphDates
	DBInstance.Raw(`SELECT DISTINCT EXTRACT(YEAR FROM TreatmentDate) AS year
					FROM "DENNIS.KIM".Patient
					ORDER BY year`).Scan(&graphDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	var graphFloatValues []entities.GraphFloatValues
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
	json.NewEncoder(w).Encode(graphFloatValues)
}

func SeasonalHazards(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var dualDates []entities.DualDates
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
	json.NewEncoder(w).Encode(graphDualValues)
}

func TestString(w http.ResponseWriter, r *http.Request) {
	// First do a query that gives all of the dates in sorted fashion
	var graphDates []entities.GraphDates
	testSQLString := `SELECT DISTINCT EXTRACT(YEAR FROM TreatmentDate) AS year
	FROM "DENNIS.KIM".Patient`
	testSQLInput := "WHERE year = 2016 OR year = 2017"
	//combinedString :=
	DBInstance.Raw(testSQLString, testSQLInput).Scan(&graphDates)
	// Next do the actual query where the two x vars are stored in a separate struct
	//username := r.URL.Query().Get("username")
	//password := r.URL.Query().Get("password")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(graphDates)
}
