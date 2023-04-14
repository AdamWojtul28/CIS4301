package entities

type GraphValues struct {
	ProductTitle string `json:"product_title"`
	XValue       string `json:"x_value"`
	YValue       uint   `json:"y_value"`
}

type GraphFloatValues struct {
	ProductTitle string  `json:"product_title"`
	XValue       string  `json:"x_value"`
	YValue       float64 `json:"y_value"`
}

type GraphDualXValues struct {
	ProductTitle string `json:"product_title"`
	XValue1      string `json:"x_value1"`
	XValue2      string `json:"x_value2"`
	YValue       uint   `json:"y_value"`
}

type GraphDates struct {
	Year string `json:"year"`
}

type DualDates struct {
	Month string `json:"month"`
	Year  string `json:"year"`
}
