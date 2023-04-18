package entities

type GraphValues struct {
	ProductTitle string `json:"product_title"`
	XValue       string `json:"x_value"`
	YValue       int    `json:"y_value"`
}

type GraphProperValues struct {
	ProductTitle string `json:"product_title"`
	XValue       int    `json:"x_value"`
	YValue       int    `json:"y_value"`
}

type GraphFloatValues struct {
	ProductTitle string  `json:"product_title"`
	XValue       string  `json:"x_value"`
	YValue       float64 `json:"y_value"`
}

type GraphFloatProperValues struct {
	ProductTitle string  `json:"product_title"`
	XValue       int     `json:"x_value"`
	YValue       float64 `json:"y_value"`
}

type GraphDualXValues struct {
	ProductTitle string `json:"product_title"`
	XValue1      string `json:"x_value1"`
	XValue2      string `json:"x_value2"`
	YValue       int    `json:"y_value"`
}

type GraphDualXValuesYFloat struct {
	ProductTitle string  `json:"product_title"`
	XValue1      string  `json:"x_value1"`
	XValue2      string  `json:"x_value2"`
	YValue       float64 `json:"y_value"`
}

type GraphDualProperXValuesYFloat struct {
	ProductTitle string  `json:"product_title"`
	XValue       int     `json:"x_value"`
	YValue       float64 `json:"y_value"`
}
type GraphDates struct {
	Year string `json:"year"`
}

type DualDates struct {
	Month string `json:"month"`
	Year  string `json:"year"`
}

type FormToParse struct {
	Product      string `form:"product"`
	AgeStart     int    `form:"ageStart"`
	AgeEnd       int    `form:"ageEnd"`
	Male         bool   `form:"male"`
	Female       bool   `form:"female"`
	OtherSex     bool   `form:"otherSex"`
	White        bool   `form:"white"`
	Black        bool   `form:"black"`
	Asian        bool   `form:"asian"`
	AI           bool   `form:"AI"`
	PI           bool   `form:"PI"`
	OtherDemo    bool   `form:"otherDemo"`
	TR           bool   `form:"TR"`
	Hospitalized bool   `form:"hospitalized"`
	Fatality     bool   `form:"fatality"`
	OtherDisp    bool   `form:"otherDisp"`
	Home         bool   `form:"home"`
	Farm         bool   `form:"farm"`
	Street       bool   `form:"street"`
	MH           bool   `form:"MH"`
	City         bool   `form:"city"`
	School       bool   `form:"school"`
	Factory      bool   `form:"factory"`
	Sport        bool   `form:"sport"`
	OtherLoc     bool   `form:"otherLoc"`
}

type FullGraph struct {
	GraphType   int                 `json:"graph_type"`
	GraphValues []GraphProperValues `json:"graph_values"`
}

type FullGraphwZeroes struct {
	GraphType         int                       `json:"graph_type"`
	ProductWithValues []ProductWithValuesStruct `json:"product_structs"`
}

type ProductWithValuesStruct struct {
	ProductTitle string       `json:"product_title"`
	Points       []GraphPoint `json:"graph_point"`
}

type GraphPoint struct {
	XValue int `json:"x_value"`
	YValue int `json:"y_value"`
}

type FullGraphFloats struct {
	GraphType               int                       `json:"graph_type"`
	ProductWithFloatsStruct []ProductWithFloatsStruct `json:"product_structs"`
}

type ProductWithFloatsStruct struct {
	ProductTitle string             `json:"product_title"`
	Points       []GraphPointFloatY `json:"graph_point"`
}

type GraphPointFloatY struct {
	XValue int     `json:"x_value"`
	YValue float64 `json:""`
}

type FullGraphSingleValue struct {
	GraphType            int                    `json:"graph_type"`
	ProductWithSingleVal []ProductWithSingleVal `json:"product_structs"`
}

type ProductWithSingleVal struct {
	ProductTitle string      `json:"product_title"`
	Points       []SingleVal `json:"y_values"`
}

type SingleVal struct {
	YValue int `json:"y_value"`
}

type FullGraphSingleFloat struct {
	GraphType               int                    `json:"graph_type"`
	ProductWithFloatsStruct []ProductWithSingleVal `json:"product_structs"`
}

type ProductWithSingleFloat struct {
	ProductTitle string        `json:"product_title"`
	Points       []SingleFloat `json:"y_values"`
}

type SingleFloat struct {
	YValue float64 `json:"y_value"`
}
