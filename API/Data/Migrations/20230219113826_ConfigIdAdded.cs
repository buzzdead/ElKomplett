using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.data.Migrations
{
    public partial class ConfigIdAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConfigId",
                table: "OrderItem",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ItemOrdered_ConfigId",
                table: "OrderItem",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "2f105ef1-9a19-46ce-9e60-9b86637ec40d");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "dda3fc39-3f3d-4d19-80e5-d8f357406f3e");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConfigId",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "ItemOrdered_ConfigId",
                table: "OrderItem");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "a5bf79b6-1646-426d-b4ef-96b2e6475a96");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "0d037af0-3514-43b0-8acd-3cdc7ca38b79");
        }
    }
}
