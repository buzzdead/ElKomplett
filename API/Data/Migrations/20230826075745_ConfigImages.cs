using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class ConfigImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PictureUrl",
                table: "Config");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Config");

            migrationBuilder.AddColumn<int>(
                name: "ConfigId",
                table: "Image",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Image_ConfigId",
                table: "Image",
                column: "ConfigId");

            migrationBuilder.AddForeignKey(
                name: "FK_Image_Config_ConfigId",
                table: "Image",
                column: "ConfigId",
                principalTable: "Config",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Image_Config_ConfigId",
                table: "Image");

            migrationBuilder.DropIndex(
                name: "IX_Image_ConfigId",
                table: "Image");

            migrationBuilder.DropColumn(
                name: "ConfigId",
                table: "Image");

            migrationBuilder.AddColumn<string>(
                name: "PictureUrl",
                table: "Config",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicId",
                table: "Config",
                type: "text",
                nullable: true);
        }
    }
}
