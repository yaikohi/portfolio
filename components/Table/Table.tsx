import React from "react";
import styles from "./Table.module.css";

type TableHeaderProps<T, K extends keyof T> = {
  columns: Array<ColumnDefinitionType<T, K>>;
};

const TableHeader = <T, K extends keyof T>({
  columns,
}: TableHeaderProps<T, K>): JSX.Element => {
  const headers = columns.map((column, index) => {
    const HeaderStyle = {
      width: column.width ?? 100, // 100 is our default value if width is not defined
      borderBottom: "2px solid black",
    };

    return (
      <th key={`headCell-${index}`} style={HeaderStyle}>
        {column.header}
      </th>
    );
  });

  return (
    <thead>
      <tr>{headers}</tr>
    </thead>
  );
};

type TableRowsProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnDefinitionType<T, K>>;
};

const RowStyle = {
  border: "1px solid black",
};

const TableRows = <T, K extends keyof T>({
  data,
  columns,
}: TableRowsProps<T, K>): JSX.Element => {
  const rows = data.map((row, index) => {
    return (
      <tr key={`row-${index}`}>
        {columns.map((column, index2) => {
          return (
            <td key={`cell-${index2}`} style={RowStyle}>
              {row[column.key]}
            </td>
          );
        })}
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
};

type ColumnDefinitionType<T, K extends keyof T> = {
  key: K;
  header: string;
  width?: number;
};

type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnDefinitionType<T, K>>;
};

const TableStyle = {
  borderCollapse: "collapse",
} as const;

const Table = <T, K extends keyof T>({
  data,
  columns,
}: TableProps<T, K>): JSX.Element => {
  return (
    <table style={TableStyle}>
      <TableHeader columns={columns} />
      <TableRows data={data} columns={columns} />
    </table>
  );
};

export default Table;
