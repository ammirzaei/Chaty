using Microsoft.EntityFrameworkCore.Migrations;

namespace Chaty.Data.Migrations
{
    public partial class MigChatProfiles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChatProfiles",
                columns: table => new
                {
                    ChatProfileID = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ChatID = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    UserID = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    ImageName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatProfiles", x => x.ChatProfileID);
                    table.ForeignKey(
                        name: "FK_ChatProfiles_Chats_ChatID",
                        column: x => x.ChatID,
                        principalTable: "Chats",
                        principalColumn: "ChatID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChatProfiles_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatProfiles_ChatID",
                table: "ChatProfiles",
                column: "ChatID",
                unique: true,
                filter: "[ChatID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ChatProfiles_UserID",
                table: "ChatProfiles",
                column: "UserID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatProfiles");
        }
    }
}
