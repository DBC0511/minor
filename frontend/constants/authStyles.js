import { StyleSheet } from "react-native";
import { colors, fonts, radii } from "./theme";

/** Shared layout for LoginScreen + SignupScreen (matches previous Auth card UI). */
export const authStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: radii.xxl,
    padding: 26,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.sage,
  },
  brandTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
  },
  tagline: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    marginBottom: 22,
    lineHeight: 19,
  },
  form: {
    gap: 14,
  },
  label: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.muted,
    marginBottom: 6,
  },
  /** Row: big emoji + text label (helps low-literacy users). */
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  labelIcon: {
    fontSize: 22,
    lineHeight: 26,
  },
  labelText: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.muted,
    flex: 1,
  },
  /** Input with leading icon inside the box. */
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    paddingLeft: 12,
    paddingRight: 8,
  },
  inputLeadingIcon: {
    fontSize: 24,
    lineHeight: 28,
    marginRight: 6,
  },
  inputInRow: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 13,
    paddingRight: 8,
    minHeight: 48,
  },
  input: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  titleIcon: {
    fontSize: 28,
    lineHeight: 32,
  },
  btnForest: {
    backgroundColor: colors.forest,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  btnDisabled: { opacity: 0.65 },
  btnForestText: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.white,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  dividerOr: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedLight,
    paddingHorizontal: 12,
  },
  btnGuest: {
    backgroundColor: colors.foam,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnGuestText: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.moss,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 18,
    gap: 4,
  },
  link: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  linkBold: {
    fontFamily: fonts.sansSemi,
    fontSize: 14,
    color: colors.forest,
  },
  backLink: {
    marginBottom: 16,
  },
  backLinkText: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.moss,
  },
});
