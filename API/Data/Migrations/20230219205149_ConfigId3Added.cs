using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.data.Migrations
{
    public partial class ConfigId3Added : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "af585d61-130d-4640-bdee-783415f0dc49");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "5b3eac21-10d2-40c3-8967-fbd4093728cb");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "c4a1eb9c-67d6-4fc1-af2f-c75146498e37");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "c9e18f04-f1a1-4e59-86d2-cafd31964db5");
        }
    }
}
