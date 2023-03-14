import unittest
from LineupOptimizerControllerModule.LineupBuilder import LineupBuilder
from LineupOptimizerControllerModule.LineupBuilderSlot import LineupBuilderSlot
from LineupOptimizerControllerModule.test_draftables import test_draftables

class LineupBuilderTests(unittest.TestCase):

    def test_true(self):
        return self.assertTrue(True)

    def test_lineup_builder_get(self):
        lineup_builder = LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings", draftables=test_draftables)
        self.assertIsNone(lineup_builder.get("TE2"))
        self.assertTrue(lineup_builder.get("WR3").title == "WR3")

    def test_with_punt_rule(self):
        lineup_builder = LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings", draftables=test_draftables).with_punt_rule("TE", 4000).with_punt_rule("WR2", 3500)
        self.assertEqual(4000, lineup_builder.get("TE").max_salary)
        self.assertEqual(3500, lineup_builder.get("WR2").max_salary)

    def test_with_valid_composition_rule(self):
        lineup_builder = self.default_draftkings_builder().with_composition_rule(position="RB", num_players=3)    
        self.assertEqual(["RB"], lineup_builder.get("FLEX").eligible_positions)
        lineup_builder = self.default_draftkings_builder().with_composition_rule(position="WR", num_players=4)    
        self.assertEqual(["WR"], lineup_builder.get("FLEX").eligible_positions)
        lineup_builder = self.default_draftkings_builder().with_composition_rule(position="TE", num_players=2)   
        self.assertEqual(["TE"], lineup_builder.get("FLEX").eligible_positions)

    def test_with_invalid_composition_rule(self):
        self.assertIsNone(self.default_draftkings_builder().with_composition_rule(position="RB", num_players=4))
        self.assertIsNone(self.default_draftkings_builder().with_composition_rule(position="WR", num_players=5))
        self.assertIsNone(self.default_draftkings_builder().with_composition_rule(position="TE", num_players=3))
        self.assertIsNone(self.default_draftkings_builder().with_composition_rule(position="QB", num_players=2))

    def test_with_valid_stack_rule_3_1(self):
        lineup_builder = self.default_draftkings_builder().with_stack_rule("KC", 3, "JAX", 1)
        self.assertTrue(lineup_builder.get("QB").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("WR1").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("WR2").eligible_team == "JAX")
        self.assertTrue(lineup_builder.get("WR3").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("FLEX").eligible_team == None)

    def test_with_valid_stack_rule_1_3(self):
        lineup_builder = self.default_draftkings_builder().with_stack_rule("KC", 1, "JAX", 3)
        self.assertTrue(lineup_builder.get("QB").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("WR1").eligible_team == "JAX")
        self.assertTrue(lineup_builder.get("WR2").eligible_team == "JAX")
        self.assertTrue(lineup_builder.get("WR3").eligible_team == "JAX")
        self.assertTrue(lineup_builder.get("FLEX").eligible_team == None)

    def test_with_valid_stack_rule_2_2(self):
        lineup_builder = self.default_draftkings_builder().with_stack_rule("KC", 2, "JAX", 2)
        self.assertTrue(lineup_builder.get("QB").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("WR1").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("WR2").eligible_team == "JAX")
        self.assertTrue(lineup_builder.get("WR3").eligible_team == "JAX")
        self.assertTrue(lineup_builder.get("FLEX").eligible_team == None)

    def test_with_valid_stack_rule_3_0(self):
        lineup_builder = self.default_draftkings_builder().with_stack_rule("KC", 3, "JAX", 0)
        self.assertTrue(lineup_builder.get("QB").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("WR1").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("WR2").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("WR3").eligible_team == None)

    def test_with_valid_stack_rule_4_3(self):
        lineup_builder = self.default_draftkings_builder().with_stack_rule("KC", 4, "JAX", 3)
        self.assertTrue(lineup_builder.get("QB").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("WR1").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("WR2").eligible_team == "JAX")
        self.assertTrue(lineup_builder.get("WR3").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("FLEX").eligible_team == "JAX")
        self.assertTrue(lineup_builder.get("TE").eligible_team == "KC")
        self.assertTrue(lineup_builder.get("RB1").eligible_team == "JAX")
        self.assertTrue(lineup_builder.get("RB2").eligible_team == None)

    def test_with_valid_stack_rule_0_0(self):
        lineup_builder = self.default_draftkings_builder().with_stack_rule("KC", 0, "JAX", 0)
        self.assertTrue(lineup_builder.get("QB").eligible_team == None)

    def test_with_invalid_stack_rule_5_5(self):
        lineup_builder = self.default_draftkings_builder().with_stack_rule("KC", 5, "JAX", 5)
        self.assertIsNone(lineup_builder)

    def test_pick_valid_player_1(self):
        lineup_builder = self.default_draftkings_builder()
        player = lineup_builder.pick_player(position="WR", team_abbr="JAX", max_salary=4000)
        self.assertEqual("WR", player.get("position"))
        self.assertEqual("JAX", player.get("team"))
        self.assertGreaterEqual(4000, player.get("salary"))

    def test_pick_valid_player_2(self):
        lineup_builder = self.default_draftkings_builder()
        player = lineup_builder.pick_player(position="TE", team_abbr="KC")
        self.assertEqual("TE", player.get("position"))
        self.assertEqual("KC", player.get("team"))

    def test_pick_valid_player_2(self):
        lineup_builder = self.default_draftkings_builder()
        player = lineup_builder.pick_player(position="RB")
        self.assertEqual("RB", player.get("position"))

    def test_pick_invalid_player(self):
        self.assertIsNone(self.default_draftkings_builder().pick_player(position="WR", team_abbr="KI", max_salary=4000))

    def test_build(self):
        lineup = self.default_draftkings_builder().build()
        self.assertIsNotNone(lineup)
        for slot in lineup.lineup.keys():
            print(slot, lineup.get(slot))

        
### HELPER METHODS ###

    def default_draftkings_builder(self):
        return LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings", draftables=test_draftables)