<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\SpipCalculator;

class SpipCalculationTest extends TestCase
{
    /**
     * Test the statistical Mode calculation with tie-breaker order.
     */
    public function test_calculate_mode_with_tie_breaking(): void
    {
        // Simple case
        $this->assertEquals('C', SpipCalculator::calculateMode(['C', 'C', 'B', 'A']));

        // Tie breaking case: E has priority over C
        $this->assertEquals('E', SpipCalculator::calculateMode(['C', 'C', 'E', 'E']));

        // Tie breaking case: C has priority over A
        $this->assertEquals('C', SpipCalculator::calculateMode(['A', 'A', 'C', 'C']));

        // Empty array returns null
        $this->assertNull(SpipCalculator::calculateMode([]));

        // Mixed casing and spaces
        $this->assertEquals('B', SpipCalculator::calculateMode([' b ', 'B', 'a']));
    }

    /**
     * Test mapping from letter grade to numeric score.
     */
    public function test_grade_to_score_mapping(): void
    {
        $this->assertEquals(5.0, SpipCalculator::gradeToScore('A'));
        $this->assertEquals(4.0, SpipCalculator::gradeToScore('b'));
        $this->assertEquals(3.0, SpipCalculator::gradeToScore('C'));
        $this->assertEquals(2.0, SpipCalculator::gradeToScore('D'));
        $this->assertEquals(1.0, SpipCalculator::gradeToScore('E'));
        $this->assertEquals(0.0, SpipCalculator::gradeToScore(null));
        $this->assertEquals(0.0, SpipCalculator::gradeToScore('INVALID'));
    }
}
