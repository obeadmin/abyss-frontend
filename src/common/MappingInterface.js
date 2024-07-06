import React, { useState, useEffect } from "react";
import "./Bulk.css";
import { parse } from "papaparse";
import * as XLSX from "xlsx";

function MappingInterface({ columns, file, onClose, onUpload }) {
  const [fileColumns, setFileColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});

  useEffect(() => {
    if (file) {
      if (file.type.includes("csv")) {
        parseFile();
      } else {
        parseExcelFile();
      }
    }
  }, [file]);

  const parseFile = () => {
    setLoading(true);
    parse(file, {
      complete: (results) => {
        setLoading(false);
        if (results.data[0]) {
          console.log("Parsed columns:", results.data[0]); // Log the parsed columns
          setFileColumns(results.data[0]); // Assuming the first row contains headers
          setData(results.data.slice(1)); // Store the rest of the data
        } else {
          setError("No columns found in file");
        }
      },
      error: (err) => {
        setLoading(false);
        setError("Error parsing file: " + err.message);
      },
    });
  };

  const parseExcelFile = () => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });
      if (worksheet[0]) {
        console.log("Parsed columns:", worksheet[0]); // Log the parsed columns
        setFileColumns(worksheet[0]);
        setData(worksheet.slice(1));
        setLoading(false);
      } else {
        setError("No columns found in file");
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleColumnChange = (systemColumn, fileColumn) => {
    setColumnMapping((prevMapping) => ({
      ...prevMapping,
      [systemColumn]: fileColumn,
    }));
  };

  const handleSubmit = () => {
    const mappedData = data.map((row) => {
      const mappedRow = {};
      columns.forEach((col) => {
        const fileColumn = columnMapping[col.header];
        if (fileColumn !== undefined) {
          const fileColumnIndex = fileColumns.indexOf(fileColumn);
          if (fileColumnIndex !== -1) {
            let value = row[fileColumnIndex];
            if (col.accessor === "year_of_establishment" || col.accessor === "number_of_departments" || col.accessor === "established_year" ||
            col.accessor === "number_of_ug_programs" ||
            col.accessor === "number_of_pg_programs" || col.accessor === "year_of_launch" || 
            col.accessor === "program_credits" || col.accessor === "duration"
          ) {
              value = Number(value);
            }
            mappedRow[col.accessor] = value;
          }
        }
      });
      return mappedRow;
    });

    console.log("Mapped Data:", mappedData); // Log the mapped data

    onUpload(mappedData); // Call the onUpload handler passed as a prop
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="mapping-interface-container">
      <h2>Map Columns</h2>
      {loading && <p>Loading file...</p>}
      {error && <p className="error">{error}</p>}
      <table className="mapping-table">
        <thead>
          <tr>
            <th>System Column</th>
            <th>File Column (Select or Enter Manually)</th>
          </tr>
        </thead>
        <tbody>
          {columns
            .filter((col) => col.accessor !== "sl_no")
            .map((column, index) => (
              <tr key={index}>
                <td>{column.header}</td>
                <td>
                  <select
                    value={columnMapping[column.header] || ""}
                    onChange={(e) =>
                      handleColumnChange(column.header, e.target.value)
                    }
                  >
                    <option value="">Select Column</option>
                    {fileColumns.map((fileColumn, i) => (
                      <option key={i} value={fileColumn}>
                        {fileColumn}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="button-container">
        <button className="submit-mapping-button" onClick={handleSubmit}>
          Submit
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default MappingInterface;
