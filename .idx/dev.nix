{ pkgs, ... }: {
  # The Nix packages to make available in your workspace.
  packages = [ pkgs.nodejs_20 ];

  # Use this section to specify your workspace settings.
  idx = {
    # List the extensions you want to be installed in your workspace.
    extensions = [ "dbaeumer.vscode-eslint" ];

    # Configure your workspace.
    workspace = {
      # Set the actions to be taken when your workspace is created.
      onCreate = {
        install-dependencies = "npm --prefix fanalelan- install";
      };
    };

    # Configure the previews in your workspace.
    previews = {
      enable = true;
      previews = {
        # The name of the preview can be anything.
        main = {
          # The command to start your development server.
          # This command must start a server that listens on the $PORT environment variable.
          command = [ "sh", "-c", "cd fanalelan- && PORT=$PORT npm run dev" ];
          # The type of the preview.
          manager = "web";
        };
      };
    };
  };
}
