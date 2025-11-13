import type { FC } from "react";
import { Moon01, Sun } from "@untitledui/icons";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { useTheme } from "@/providers/theme-provider";

/**
 * Theme toggle button for switching between light and dark mode.
 * Uses the ThemeProvider context to manage theme state.
 */
export const ThemeToggle: FC = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <ButtonUtility
            color="tertiary"
            size="md"
            tooltip={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            icon={theme === "light" ? Moon01 : Sun}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        />
    );
};
