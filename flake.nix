{
  description = "VS Code extension development";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs
            yarn
            vsce

            libwebp # for check_and_create_images.sh
            # Common Electron runtime libraries
            alsa-lib
            at-spi2-atk
            at-spi2-core
            atk
            cairo
            cups
            dbus
            expat
            glib
            gtk3
            libgbm
            libglvnd
            libX11
            libxcb
            libXcomposite
            libXdamage
            libXext
            libXfixes
            libxkbcommon
            libXrandr
            mesa
            nspr
            nss
            pango
            systemd
            unzip
          ];
          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath (
            with pkgs;
            [
              alsa-lib
              at-spi2-atk
              at-spi2-core
              atk
              cairo
              cups
              dbus
              expat
              glib
              gtk3
              libgbm
              libglvnd
              libX11
              libxcb
              libXcomposite
              libXdamage
              libXext
              libXfixes
              libxkbcommon
              libXrandr
              mesa
              nspr
              nss
              pango
              systemd
            ]
          );
        };
      }
    );
}
