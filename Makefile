all :
	@sudo mkdir -p /home/aoueldma/data/dt_volume
	@sudo mkdir -p /home/aoueldma/data/wd_volume
	@cd srcs && docker compose up -d
down:
	@cd srcs && docker compose down
	@cd srcs && docker system prune -af
fclean :
	@cd srcs && docker compose down
	@cd srcs && docker system prune -af
	@sudo rm -rf /home/aoueldma/data/dt_volume
	@sudo rm -rf /home/aoueldma/data/wd_volume
	@docker volume rm srcs_mariadb_volume
	@docker volume rm srcs_wordpress_volume